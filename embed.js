(function () {
  if (window.location.search.includes('embedded=true')) return;

  const style = document.createElement("style");
  style.textContent = `
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
      z-index: 999;
      border: none;
    }

    @media (max-width: 768px) {
      #chat-box {
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }
  `;
  document.head.appendChild(style);

  const toggleBtn = document.createElement("button");
  toggleBtn.id = "chat-toggle";
  toggleBtn.setAttribute("aria-label", "Chat starten");
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

  toggleBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
    toggleBtn.style.display = "none";

    chatBox.addEventListener("load", () => {
      try {
        const iframeDoc = chatBox.contentDocument || chatBox.contentWindow.document;
        const header = iframeDoc.querySelector(".chat-header");
        if (!header || iframeDoc.getElementById("chat-close")) return;

        // Button erzeugen
        const closeBtn = iframeDoc.createElement("button");
        closeBtn.id = "chat-close";
        closeBtn.setAttribute("aria-label", "Chat schließen");
        closeBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>`;

        // Button-Styling direkt im Header neben Menü-Icon
        closeBtn.style.cssText = `
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: absolute;
          top: 8px;
          right: 56px;
          z-index: 10;
        `;

        // Header vorbereiten
        header.style.position = "relative";
        header.appendChild(closeBtn);

        closeBtn.addEventListener("click", () => {
          chatBox.style.display = "none";
          toggleBtn.style.display = "flex";
        });

      } catch (e) {
        console.error("Close-Button konnte nicht platziert werden:", e);
      }
    });
  });
})();
