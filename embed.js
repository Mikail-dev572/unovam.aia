(function () {
  if (window.location.search.includes('embedded=true')) return;

  // === STYLES ===
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    #chat-toggle {
      position: fixed;
      bottom: 24px;
      right: 24px;
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

    #chat-toggle svg {
      width: 28px;
      height: 28px;
      stroke: white;
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
    }
  `;
  document.head.appendChild(styleTag);

  // === ELEMENTE ===
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "chat-toggle";
  toggleBtn.setAttribute("aria-label", "Chat starten");
  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`;

  const chatBox = document.createElement("iframe");
  chatBox.id = "chat-box";
  chatBox.src = "https://mikail-dev572.github.io/unovam.aia/chat-only.html?embedded=true";
  chatBox.style.display = "none";

  document.body.appendChild(toggleBtn);
  document.body.appendChild(chatBox);

  // === BUTTON-LOGIK ===
  toggleBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
    toggleBtn.style.display = "none";

    chatBox.addEventListener("load", () => {
      try {
        const iframeDoc = chatBox.contentDocument || chatBox.contentWindow.document;
        const header = iframeDoc.querySelector(".chat-header");
        if (!header || iframeDoc.getElementById("chat-close")) return;

        const closeBtn = iframeDoc.createElement("button");
        closeBtn.id = "chat-close";
        closeBtn.setAttribute("aria-label", "Chat schließen");
        closeBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>`;
        closeBtn.style.cssText = `
          position: absolute;
          top: 12px;
          right: 56px;
          width: 42px;
          height: 42px;
          background: #222;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          z-index: 1001;
        `;

        closeBtn.addEventListener("click", () => {
          chatBox.style.display = "none";
          toggleBtn.style.display = "flex";
        });

        header.style.position = "relative"; // Positionierung als Anker
        header.appendChild(closeBtn);
      } catch (err) {
        console.error("Fehler beim Einfügen des Schließen-Buttons:", err);
      }
    });
  });
})();
