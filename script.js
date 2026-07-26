const BACKEND_URL = 'https://travel-assistant-backend-z9tr.onrender.com';

async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input ? input.value.trim() : '';
  if (!message) return;

  const history = JSON.parse(localStorage.getItem('chat-history') || '[]');

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Ошибка сервера: ${res.status}`);
    }

    const data = await res.json();
    const assistantMessage = data.message;

    history.push({ role: 'user', text: message });
    history.push({ role: 'assistant', text: assistantMessage });
    localStorage.setItem('chat-history', JSON.stringify(history));

    renderChat();
    if (input) input.value = '';
  } catch (e) {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}

function renderChat() {
  const chatArea = document.getElementById('chat-area');
  if (!chatArea) return;
  chatArea.innerHTML = '';

  const history = JSON.parse(localStorage.getItem('chat-history') || '[]');
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = item.role === 'user' ? 'user-message' : 'assistant-message';
    div.textContent = item.text;
    chatArea.appendChild(div);
  });

  chatArea.scrollTop = chatArea.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  renderChat();
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }

  const input = document.getElementById('user-input');
  if (input) {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });
  }
});
