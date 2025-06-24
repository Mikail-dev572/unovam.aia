(function () {
  if (window.location.search.includes('embedded=true')) return;

  // === STYLE ===
  const style = document.createElement("style");
  style.textContent = `
    #chat-toggle, #chat-close {
      position: fixed;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: #1a1a1a;
      color: white;
      z-index: 1000;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      display: flex;
      opacity: 1;
      transition: opacity 0.3s ease;
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
      opacity: 0;
      pointer-events: none;
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
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      z-index: 999;
      border: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    @media (max-width: 768px) {
      #chat-box {
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
      }

      #chat-close {
        top: 68px;
        right: 56px;
        bottom: auto !important;
        left: auto;
        width: 42px;
        height: 42px;
        background: #1a1a1a;
        position: fixed;
        z-index: 1001;
      }
    }
  `;
  document.head.appendChild(style);

  // === ELEMENTE ===
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "chat-toggle";
  toggleBtn.setAttribute("aria-label", "Chat starten");
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

  document.body.appendChild(toggleBtn);
  document.body.appendChild(closeBtn);
  document.body.appendChild(chatBox);

  // === VERHALTEN ===
  toggleBtn.addEventListener("click", () => {
    chatBox.style.opacity = "1";
    chatBox.style.transform = "translateY(0)";
    chatBox.style.pointerEvents = "auto";

    toggleBtn.style.opacity = "0";
    toggleBtn.style.pointerEvents = "none";

    closeBtn.style.opacity = "1";
    closeBtn.style.pointerEvents = "auto";
  });

  closeBtn.addEventListener("click", () => {
    chatBox.style.opacity = "0";
    chatBox.style.transform = "translateY(20px)";
    chatBox.style.pointerEvents = "none";

    toggleBtn.style.opacity = "1";
    toggleBtn.style.pointerEvents = "auto";

    closeBtn.style.opacity = "0";
    closeBtn.style.pointerEvents = "none";
  });
})();
