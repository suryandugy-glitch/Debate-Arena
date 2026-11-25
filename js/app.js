



function stanceLabels(s) {
  if (s === 'for')     return { ai: 'Argues FOR', you: 'Argues AGAINST' };
  if (s === 'against') return { ai: 'Argues AGAINST', you: 'Argues FOR' };
  return { ai: "Devil's Advocate", you: 'The Challenger' };
}

function intensityInstructions(i) {
  if (i === 'polite')   return 'Be respectful and measured. Acknowledge valid points before countering. Maintain a civil, collegial tone.';
  if (i === 'brutal')   return 'Be fierce, blunt, and relentless. Demolish weak arguments without mercy. Be unapologetically provocative.';
  if (i === 'academic') return 'Use formal academic register. Do not invent studies, statistics or citations. Structure arguments with academic rigour.';
  return 'Be direct and punchy. Give sharp, confident rebuttals. Forceful but not aggressive.';
}

function systemPrompt() {
  const dir = stance === 'for' ? 'Argue strongly IN FAVOUR of the motion.'
            : stance === 'against' ? 'Argue strongly AGAINST the motion.'
            : "Play devil's advocate — always counter whatever the human argues.";
  return `You are a formidable debate opponent. The motion: "${topic}". ${dir}

Style: ${intensityInstructions(intensity)}

Rules:
- Stay on your assigned side no matter what. Never concede.
- Lead every reply by directly addressing the human's point, then press your argument.
- 2-4 sentences per reply unless making a complex point.
- Use rhetorical questions, vivid analogies, and compelling logic.
- Never break character or acknowledge the exercise structure.`;
}

async function startDebate() {
  document.getElementById('setup').style.display = 'none';
  const dEl = document.getElementById('debate');
  dEl.style.display = 'flex'; dEl.style.flexDirection = 'column';
  const labels = stanceLabels(stance);
  document.getElementById('ai-stance-lbl').textContent = labels.ai;
  document.getElementById('your-stance-lbl').textContent = labels.you;
  document.getElementById('topic-ribbon').textContent = '"' + topic + '"';
  document.getElementById('chat').innerHTML = '';
  document.getElementById('ended-wrap').style.display = 'none';
  document.getElementById('input-wrap').style.display = 'block';
  history = []; active = true;
  const opener = `The motion is: "${topic}". Open with a confident 3-sentence opening statement for your assigned side. Be direct and compelling.`;
  history.push({ role: 'user', content: opener });
  const tid = showTyping();
  const reply = await callAI();
  removeTyping(tid);
  if (reply) {

    history.push({
      role: 'assistant',
      content: reply
    });

    addBubble('ai', reply);

    speakText(reply);
  }
  document.getElementById('user-input').focus();
}

async function sendMsg() {
  if (!active) return;
  const inp = document.getElementById('user-input');
  const text = inp.value.trim(); if (!text) return;
  inp.value = '';
  addBubble('user', text);
  history.push({ role: 'user', content: text });
  document.getElementById('send-btn').disabled = true;
  const tid = showTyping();
  const reply = await callAI();
  removeTyping(tid);
  document.getElementById('send-btn').disabled = false;
  if (reply) {

    history.push({
      role: 'assistant',
      content: reply
    });

    addBubble('ai', reply);

    speakText(reply);
  }
  inp.focus();
}

let voicesLoaded = false;

/* preload voices */

speechSynthesis.onvoiceschanged = () => {

  speechSynthesis.getVoices();

  voicesLoaded = true;
};

function speakText(text) {

  if (!voiceEnabled) return;

  /* wait for voices */

  if (!voicesLoaded) {

    setTimeout(() => {

      speakText(text);

    }, 300);

    return;
  }

  speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = 'en-US';

  speech.pitch = 1;

  speech.rate = 1;

  speech.volume = 1;

  const voices =
    speechSynthesis.getVoices();

  const preferredVoice =

    voices.find(v =>
      v.name.includes('Google UK English Male')
    )

    ||

    voices.find(v =>
      v.name.includes('Google US English')
    )

    ||

    voices[0];

  if (preferredVoice) {

    speech.voice = preferredVoice;
  }

  /* small delay fixes distortion */

  setTimeout(() => {

    speechSynthesis.speak(speech);

  }, 100);
}

let groqApiKey = "";

async function callAI() {
  // Prefer a same-origin server endpoint: no provider key reaches the browser.
  try {
    const backend = await fetch('/api/debate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({topic, stance, intensity: ['polite','brutal','academic'].includes(intensity) ? intensity : 'balanced', history: history.slice(-20)})
    });
    if (backend.ok) {
      const data = await backend.json();
      if (data.reply) return data.reply;
    } else if (backend.status !== 404 && backend.status !== 503) {
      return 'The debate server is temporarily unavailable. Try again shortly.';
    }
  } catch {
    // Static GitHub Pages deployments have no backend. BYOK remains available.
  }
  if (!groqApiKey) {
    groqApiKey = window.prompt('Static demo: enter your Groq API key to send requests directly from this browser to Groq. For a server-side key, use the Vercel deployment instead.')?.trim() ?? '';
  }
  if (!groqApiKey) return 'A Groq API key is required on static hosting. Deploy the backend for key-free chat.';

  try {

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + groqApiKey
      },

      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',

        messages: [
          {
            role: 'system',
            content: systemPrompt()
          },

          ...history
        ],

        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (res.status === 401 || res.status === 403) {
      groqApiKey = "";
      return "Groq rejected the API key. Try again with a valid key.";
    }
    if (!res.ok) return "Groq could not complete this request. Try again shortly.";

    const data = await res.json();

    return data.choices?.[0]?.message?.content || 'No response from AI';

  } catch (err) {

    console.error(err);

    return 'Connection error — please try again.';
  }
}

let typingCount = 0;
function addBubble(who, text) {
  const chat = document.getElementById('chat');
  const emptyEl = document.getElementById('empty-chat');
  if (emptyEl) emptyEl.remove();
  const row = document.createElement('div');
  row.className = `msg-row ${who}`;
  const av = document.createElement('div');
  av.className = `avatar ${who === 'ai' ? 'ai-av' : 'user-av'}`;
  av.textContent = who === 'ai' ? 'AI' : 'YOU';
  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap';
  const sender = document.createElement('div');
  sender.className = 'bubble-sender';
  sender.textContent = who === 'ai' ? 'AI OPPONENT' : 'YOU';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(sender);
  wrap.appendChild(bubble);
  row.appendChild(av);
  row.appendChild(wrap);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const chat = document.getElementById('chat');
  const id = 'typ' + (++typingCount);
  const row = document.createElement('div');
  row.className = 'msg-row ai'; row.id = id;
  const av = document.createElement('div');
  av.className = 'avatar ai-av'; av.textContent = 'AI';
  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  wrap.appendChild(bubble);
  row.appendChild(av); row.appendChild(wrap);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return id;
}

function removeTyping(id) { const el = document.getElementById(id); if (el) el.remove(); }

function endDebate() {
  speechSynthesis.cancel();
  active = false;
  document.getElementById('input-wrap').style.display = 'none';
  document.getElementById('ended-wrap').style.display = 'block';
}

function resetToSetup() {
  document.getElementById('debate').style.display = 'none';
  document.getElementById('setup').style.display = 'flex';
  topicEl.value = '';
  document.getElementById('start-btn').disabled = true;
  topicEl.focus();
}