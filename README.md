<img src="cellar-logo.png" width="64" height="64" alt="Debate Arena logo">

# Debate Arena by Cellar

[Launch Debate Arena](https://suryandugy-glitch.github.io/Debate-Arena/) · [Report an issue](https://github.com/suryandugy-glitch/Debate-Arena/issues)

Choose a topic and a side. On a configured Vercel deployment, replies use a server-side Groq key. On static GitHub Pages, the app offers an optional bring-your-own-key fallback.

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple)
![Hackathon Project](https://img.shields.io/badge/Hackathon-Project-orange)
![License](https://img.shields.io/badge/License-MIT-green)

> **An AI-Powered Debate Platform that helps users sharpen critical thinking, public speaking, and argumentation skills through real-time AI debates.**

🌐 **Live Demo:** https://suryandugy-glitch.github.io/Debate-Arena/

The secure backend sends requests to Groq without exposing the server key to visitors. GitHub Pages has no server functions: its bring-your-own-key mode sends requests directly from your browser to Groq, so only use a key you are comfortable using in this way.

---

## Server-side backend (recommended)

This repository includes a bounded serverless API at `api/debate.js`.

1. Import the repository into Vercel.
2. Set `GROQ_API_KEY` in the Vercel project's environment variables. Never put this key into HTML or public JavaScript.
3. Redeploy and open the Vercel URL. The existing frontend calls same-origin `POST /api/debate` first.
4. Run the backend unit tests with `node --test tests/*.test.cjs`.

The backend validates topic, stance and message history, caps output, and times out slow upstream calls. It is an **early beta**: add authentication, rate limiting, observability and provider-cost controls before allowing unrestricted public use.

The GitHub Pages edition remains a static, browser-key version. It cannot use server-side secrets or promise user accounts and durable debate history.

---

## 🚀 About The Project

**Debate Arena** is an interactive web application that allows users to engage in intelligent debates with an AI opponent. Whether you're preparing for a debate competition, improving communication skills, or simply exploring different perspectives, Debate Arena provides an engaging and immersive experience.

The platform combines **Artificial Intelligence**, **Voice Recognition**, and **Speech Synthesis** to create a realistic debate environment where users can speak naturally and receive AI-generated responses in real time.

---

## ✨ Key Features

### 🤖 AI-Powered Debate Engine

* Engage in dynamic debates with an intelligent AI opponent.
* Receive context-aware arguments and counterarguments.
* Supports multiple debate topics and viewpoints.

### 🎙️ Voice Recognition

* Speak naturally instead of typing.
* Converts speech into text instantly.
* Creates a hands-free debating experience.

### 🔊 AI Voice Responses

* AI replies using speech synthesis.
* Makes conversations feel more interactive and realistic.
* Enhances accessibility and engagement.

### 🎨 Modern Animated Interface

* Smooth transitions and animations.
* Responsive design for desktops and mobile devices.
* Clean and intuitive user experience.

### 📱 Mobile Friendly

* Optimized for Android Chrome and modern browsers.
* Seamless experience across devices.

---

## 🛠️ Technology Stack

| Technology           | Purpose              |
| -------------------- | -------------------- |
| HTML5                | Structure            |
| CSS3                 | Styling & Animations |
| JavaScript           | Application Logic    |
| Web Speech API       | Voice Recognition    |
| Speech Synthesis API | AI Voice Output      |
| AI Integration       | Debate Generation    |

---

## 📂 Project Structure

```bash
Debate-Arena/
│
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

## 🎯 How It Works

1. Open the application.
2. Select or enter a debate topic.
3. Choose your stance.
4. Speak your argument using voice input.
5. AI analyzes your statement.
6. AI generates and speaks a counterargument.
7. Continue the debate in real time.

---

## 💡 Use Cases

* Debate Competition Practice
* Public Speaking Training
* Critical Thinking Development
* Interview Preparation
* Classroom Discussions
* Communication Skill Enhancement

---

## 📸 Screenshots

> Add screenshots of your application here for better presentation.

```markdown
![Home Page](screenshots/home.png)
![Debate Interface](screenshots/debate.png)
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/suryandugy-glitch/Debate-Arena.git
```

### Run Locally

Option 1:

```bash
Open index.html directly in your browser.
```

Option 2 (Recommended):

```bash
Use VS Code Live Server Extension.
```

---

## 🔮 Future Enhancements

* Multiple AI Debate Personalities
* Leaderboard & Ranking System
* Debate Score Analytics
* Multiplayer Human vs Human Mode
* Topic Recommendation Engine
* Debate History & Performance Tracking
* AI Judge and Feedback System

---

## 👨‍💻 Team Tech Farmers

### Team Members

* **Suryandu Ganguly**
* **Disha Chakraborty**
* **Utsab Chowdhury**
* **Samriddhi Pratap Singh**

---

## 📧 Contact

For collaborations, suggestions, or feedback:

📩 **[techfarmers4@gmail.com](mailto:techfarmers4@gmail.com)**

---

## 🌟 Support

If you like this project:

⭐ Star this repository

🍴 Fork the project

📢 Share it with others

---

## 📜 License

This project is developed for educational, innovation, and hackathon purposes.

---

<div align="center">

### 🎤 Think. Speak. Debate. Evolve.

**Built with ❤️ by Team Tech Farmers**

</div>
