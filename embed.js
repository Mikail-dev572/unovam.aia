(function () {
  if (window.location.search.includes('embedded=true')) return;

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    #chat-toggle, #chat-close {
      position: fixed;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: #1a1a1a;
      color: white;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    #chat-toggle {
      bottom: 24px;
      right: 24px;
    }

    #chat-toggle svg,
    #chat-close svg {
      width: 28px;
      height: 28px;
      stroke: white;
    }

    #chat-close {
      display: none;
      bottom: 24px;
      right: 24px;
    }

    #chat-box {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 420px;
      height: 620px;
      max-width: 90%;
      max-height: 90%;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999;
      border: none;
    }

    @media (max-width: 768px) {
  #chat-box {
    bottom: 0 !important;
    right: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 0 !important;
  }

  #chat-close {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 28px); /* Grundhöhe */
    transform: translateY(6px); /* Feinjustierung */
    right: 56px;
    width: 42px;
    height: 42px;
    background: #222;
    border-radius: 50%;
    z-index: 1001;
    display: flex !important;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
}

  `;
  document.head.appendChild(styleTag);

  const toggleBtn = document.createElement("button");
  toggleBtn.id = "chat-toggle";
  toggleBtn.setAttribute("aria-label", "Chat starten");
  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`;

  const closeBtn = document.createElement("button");
  closeBtn.id = "chat-close";
  closeBtn.setAttribute("aria-label", "Chat schließen");
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`;

  const chatBox = document.createElement("iframe");
  chatBox.id = "chat-box";
  chatBox.src = "https://mikail-dev572.github.io/unovam.aia/chat-only.html?embedded=true";
  chatBox.style.display = "none";

  document.body.appendChild(toggleBtn);
  document.body.appendChild(closeBtn);
  document.body.appendChild(chatBox);

  toggleBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
    toggleBtn.style.display = "none";
    closeBtn.style.display = "flex";
    toggleBtn.setAttribute("aria-expanded", "true");
  });

  closeBtn.addEventListener("click", () => {
    chatBox.style.display = "none";
    toggleBtn.style.display = "flex";
    closeBtn.style.display = "none";
    toggleBtn.setAttribute("aria-expanded", "false");
  });
})();
