import { NanoBananaAI } from '../utils/nanoBanana';
import { db } from '../services/databaseService';

export async function initChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const typingIndicator = document.getElementById('typing-indicator');

    if (!chatMessages || !chatForm) return;

    let chatHistory = [];

    const addMessage = (text, sender = 'user') => {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user'
            ? 'flex flex-col gap-2 max-w-[85%] self-end items-end animate-in fade-in slide-in-from-right-4 duration-500'
            : 'flex flex-col gap-2 max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-500';

        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        msgDiv.innerHTML = sender === 'user'
            ? `
      <div class="bg-white border border-black/5 text-text-main p-5 rounded-[2rem] rounded-tr-none shadow-xl">
         <p class="text-[13px] leading-relaxed">${text}</p>
      </div>
      <div class="flex items-center gap-2 mr-4 opacity-30">
        <span class="text-[9px] font-bold tracking-widest">${time}</span>
        <span class="material-symbols-outlined text-sm text-primary fill-1">done_all</span>
      </div>
    `
            : `
      <div class="bg-[#eeada7] text-[#5f5f5f] p-5 rounded-[2rem] rounded-tl-none shadow-2xl relative">
         <p class="text-[13px] leading-relaxed font-medium">${text}</p>
      </div>
      <span class="text-[9px] font-bold opacity-30 ml-4 tracking-widest">${time} · Assessorando Sonhos</span>
    `;

        chatMessages.insertBefore(msgDiv, typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    chatForm.onsubmit = async (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        typingIndicator.classList.remove('hidden');
        typingIndicator.classList.add('flex');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await NanoBananaAI.getChatResponse(chatHistory, text);

            // Update history for next call
            chatHistory.push({ role: "user", parts: [{ text: text }] });
            chatHistory.push({ role: "model", parts: [{ text: response }] });

            typingIndicator.classList.remove('flex');
            typingIndicator.classList.add('hidden');
            addMessage(response, 'miga');

            // Persist to Supabase
            db.create('chat_messages', {
                role: 'user',
                content: text
            });
            db.create('chat_messages', {
                role: 'model',
                content: response
            });

        } catch (error) {
            console.error("Erro na Miga:", error);
            typingIndicator.classList.remove('flex');
            typingIndicator.classList.add('hidden');
            addMessage("Me desculpe, maravilhosa, tive um pequeno tropeço aqui. Mas estou de volta! O que você dizia?", 'miga');
        }
    };
}
