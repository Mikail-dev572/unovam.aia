(function () {
  const css = `
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #f9fafb;
      color: #444;
    }
    #chat-toggle, #chat-close {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
    }
    #chat-toggle svg, #chat-close svg {
      width: 28px;
      height: 28px;
      stroke: white;
    }
    #chat-close { display: none; }
    #chat-box {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 460px;
      height: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999;
    }
    @media (max-width: 500px) {
      #chat-box {
        width: 90%;
        height: 90%;
        right: 5%;
      }
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.innerText = css;
  document.head.appendChild(styleTag);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'chat-toggle';
  toggleBtn.setAttribute('aria-label', 'Chat starten');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  const closeBtn = document.createElement('button');
  closeBtn.id = 'chat-close';
  closeBtn.setAttribute('aria-label', 'Chat schließen');
  closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;

  const chatBox = document.createElement('iframe');
  chatBox.id = 'chat-box';
  chatBox.src = 'https://unovam-chatbot.onrender.com';
  chatBox.style.display = 'none';

  document.body.appendChild(toggleBtn);
  document.body.appendChild(closeBtn);
  document.body.appendChild(chatBox);

  toggleBtn.addEventListener('click', () => {
    chatBox.style.display = 'flex';
    toggleBtn.style.display = 'none';
    closeBtn.style.display = 'flex';
    toggleBtn.setAttribute('aria-expanded', 'true');
  });

  closeBtn.addEventListener('click', () => {
    chatBox.style.display = 'none';
    toggleBtn.style.display = 'flex';
    closeBtn.style.display = 'none';
    toggleBtn.setAttribute('aria-expanded', 'false');
  });
})();