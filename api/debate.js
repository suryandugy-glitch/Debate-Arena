const STANCES = new Set(['for', 'against', 'devil']);
const INTENSITIES = new Set(['polite', 'brutal', 'academic', 'balanced']);

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('JSON object required');
  const { topic, stance, intensity, history } = body;
  if (typeof topic !== 'string' || topic.trim().length < 3 || topic.length > 250) throw new Error('Invalid topic');
  if (!STANCES.has(stance)) throw new Error('Invalid stance');
  if (!INTENSITIES.has(intensity)) throw new Error('Invalid intensity');
  if (!Array.isArray(history) || history.length < 1 || history.length > 20) throw new Error('Invalid history');
  const messages = history.map(item => {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string' || item.content.length > 4000 || !item.content.trim()) throw new Error('Invalid message');
    return { role: item.role, content: item.content };
  });
  if (messages.at(-1).role !== 'user') throw new Error('User message required');
  return { topic: topic.trim(), stance, intensity, messages };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
  if (Number(req.headers['content-length'] || 0) > 65000) return res.status(413).json({ error: 'Request too large' });
  let input;
  try { input = validate(req.body); } catch (error) { return res.status(400).json({ error: error.message }); }
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: 'Server-side AI key not configured', code: 'UNCONFIGURED' });
  const stanceText = input.stance === 'for' ? 'support the motion' : input.stance === 'against' ? 'oppose the motion' : 'counter the user';
  const system = `Debate exercise on: "${input.topic}". You must ${stanceText}. Style: ${input.intensity}. Critique arguments, not people. Never fabricate citations, statistics, studies, or quotes. Clearly say when uncertain. Reply in 2-4 sentences.`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: system }, ...input.messages], max_tokens: 450, temperature: 0.65 }),
      signal: controller.signal
    });
    if (!upstream.ok) return res.status(502).json({ error: 'Model provider unavailable' });
    const result = await upstream.json();
    const reply = result.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return res.status(502).json({ error: 'Empty model response' });
    return res.status(200).json({ reply, mode: 'server' });
  } catch { return res.status(504).json({ error: 'Model request failed or timed out' }); }
  finally { clearTimeout(timer); }
};
module.exports.validate = validate;
