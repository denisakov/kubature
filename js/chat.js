/**
 * @fileoverview AI Chat Assistant for Kubature Portfolio.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyDLxJP0R0moISWAD277YEBBmirTInJzBrY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: { temperature: 0.4 }
});
const MESSAGES = [
  "Ask me if I can build something for you.",
  "What do you need?",
  "Can I help automate your workflow?",
  "Looking for some specific expertise?",
  "Need a custom Google Apps Script?",
  "How can I streamline your business today?",
  "Interested in Google Workspace integrations?",
  "Want to know about my past scraping projects?",
  "Looking for a specialized web application?",
  "Describe your project idea to me.",
  "Which technologies should we use?",
  "Are you looking for a long-term technical partner?"
];
let projects = [];
let currentIndex = 0;
/**
 * Initializes the chat assistant.
 */
async function initChat() {
  const input = document.getElementById('ai-chat-input');
  const window = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('close-chat');
  if (!input || !window || !closeBtn) {
    return;
  }
  startPlaceholderRotation(input);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChatInput(input.value);
      input.value = '';
    }
  });
  closeBtn.addEventListener('click', () => {
    window.classList.add('chat-window-hidden');
  });
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyfhorMP1QyHKWleZcmgE4kxnn7pdARfKF_N1km--g4Ly30EX1i7l5JH4D_k3SNQgc41w/exec');
    const res = await response.json();
    projects = res.data;
  } catch (err) {
    console.log("Failed to load project data for chat", err);
  }
}
/**
 * Rotates the placeholder text of the input field.
 * @param {HTMLInputElement} inputEl
 */
function startPlaceholderRotation(inputEl) {
  setInterval(() => {
    inputEl.classList.remove('placeholder-animate');
    void inputEl.offsetWidth; // Trigger reflow
    currentIndex = (currentIndex + 1) % MESSAGES.length;
    setTimeout(() => {
      inputEl.placeholder = MESSAGES[currentIndex];
      inputEl.classList.add('placeholder-animate');
    }, 50);
  }, 4000);
}
/**
 * Handles user input and opens the chat window.
 * @param {string} text
 */
async function handleChatInput(text) {
  const query = text.trim();
  if (!query) {
    return;
  }
  const chatWindow = document.getElementById('ai-chat-window');
  chatWindow.classList.remove('chat-window-hidden');
  // Set golden ratio height based on project area width
  const projectArea = document.getElementById('cardList');
  if (projectArea) {
    const width = projectArea.offsetWidth;
    chatWindow.style.width = `${width / 2}px`;
    chatWindow.style.height = `${(width / 2) * 1.618}px`;
    chatWindow.style.maxHeight = '70vh';
  }
  appendMessage(query, 'user');
  await getAIReponse(query);
}
/**
 * Fetches response from Gemini AI.
 * @param {string} query
 */
async function getAIReponse(query) {
  const loading = document.getElementById('chat-loading');
  loading.classList.remove('hidden');
  const context = projects.slice(0, 15).map(p => `
    Title: ${p.title}
    Desc: ${p.description}
    Tech: ${p.technologies}
  `).join("\n---\n");
  const prompt = `You are Denis's Portfolio Assistant. Answer the user's question concisely based on these projects:
  ${context}
  
  User: ${query}
  
  Important: End your response with a comma-separated list of 3-5 keywords or technical terms found in your answer that would help filter the project list, prefixed with "KEYWORDS: ".`;
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    loading.classList.add('hidden');
    processAIReponse(responseText);
  } catch (err) {
    loading.classList.add('hidden');
    appendMessage("Sorry, I'm having trouble connecting right now.", 'bot');
    console.error("Gemini API Error:", err);
  }
}
/**
 * Processes the AI response and triggers filtering.
 * @param {string} text
 */
function processAIReponse(text) {
  const parts = text.split("KEYWORDS:");
  const message = parts[0].trim();
  const keywordsStr = parts[1] ? parts[1].trim() : "";
  appendMessage(message, 'bot');
  if (keywordsStr) {
    const keywords = keywordsStr.split(',').map(k => k.trim().toLowerCase());
    triggerFiltering(keywords);
  }
}
/**
 * Appends a message to the chat window.
 * @param {string} text
 * @param {string} sender
 */
function appendMessage(text, sender) {
  const container = document.getElementById('chat-messages');
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${sender}-msg`;
  msgEl.innerText = text;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}
/**
 * Filters the project list based on AI-extracted keywords.
 * @param {string[]} keywords
 */
function triggerFiltering(keywords) {
  const cards = document.querySelectorAll('project-card');
  cards.forEach(card => {
    const searchBlob = (card.getAttribute('data-search') || '').toLowerCase();
    const matches = keywords.some(k => searchBlob.includes(k));
    if (matches) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}
initChat();
