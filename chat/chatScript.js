import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = ""; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.5 } // Lower temperature for factual accuracy
});

let projects = [];

async function init() {
    try {
        const response = await fetch('projects.json');
        projects = await response.json();
    } catch (err) { console.error("Data load failed", err); }
}

function findRelevantProjects(query) {
    const terms = query.toLowerCase().split(/\W+/).filter(t => t.length > 3);
    return projects.map(p => {
        let score = 0;
        const blob = `${p.projectDesc} ${p.projectSkills.join(' ')}`.toLowerCase();
        terms.forEach(t => { if (blob.includes(t)) score++; });
        return { ...p, score };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
}

async function handleChat() {
    const inputField = document.getElementById('user-input');
    const loading = document.getElementById('loading');
    const question = inputField.value.trim();
    if (!question) return;

    appendMessage(question, 'user-msg');
    inputField.value = '';
    loading.classList.remove('hidden');

    const matches = findRelevantProjects(question);
    const context = matches.map(m => `
        ID: ${m.projectId}
        Title/Desc: ${m.projectDesc}
        Skills: ${m.projectSkills.join(', ')}
        Proposal Highlight: ${m.proposal.proposalText.substring(0, 300)}...
    `).join("\n---\n");

    try {
        const prompt = `You are Denis's AI Agent. Based on the following project context, answer the user. 
        Context: ${context}
        User Question: ${question}
        Rule: Be concise. If a specific project from the context is very relevant, mention its "Project Link" or ID clearly.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        loading.classList.add('hidden');
        appendMessage(text, 'bot-msg', matches);
    } catch (err) {
        loading.classList.add('hidden');
        appendMessage("Error connecting to Gemini. Please check API restrictions.", 'bot-msg');
    }
}

function appendMessage(text, className, matches = []) {
    const chatBox = document.getElementById('chat-box');
    const msgContainer = document.createElement('div');
    msgContainer.className = `${className} p-4 rounded-2xl max-w-[85%] border`;
    
    // Process text for basic line breaks
    msgContainer.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;

    // If it's a bot message and we have matches, append a "Evidence" card
    if (className === 'bot-msg' && matches[0]?.score > 0) {
        const p = matches[0];
        const card = document.createElement('div');
        card.className = "project-card border shadow-sm mt-3 bg-slate-50 p-3 rounded-lg text-sm";
        card.innerHTML = `
            <div class="font-bold text-blue-700 text-xs mb-1">RELEVANT WORK:</div>
            <div class="text-slate-700 italic">"${p.projectDesc.substring(0, 100)}..."</div>
            <div class="mt-2 flex flex-wrap gap-1">
                ${p.projectSkills.slice(0,3).map(s => `<span class="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded">${s}</span>`).join('')}
            </div>
            <a href="${p.projectUrl}" target="_blank" class="text-blue-600 underline mt-2 inline-block font-medium">View Project on Upwork →</a>
        `;
        msgContainer.appendChild(card);
    }

    chatBox.appendChild(msgContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('send-btn').onclick = handleChat;
document.getElementById('user-input').onkeypress = (e) => e.key === 'Enter' && handleChat();

init();