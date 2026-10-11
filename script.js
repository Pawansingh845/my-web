
/* =====================================================
   PAWAN SINGH - DEVOPS PORTFOLIO + AI CHATBOT
===================================================== */

(function () {
    "use strict";

    function initializePortfolio() {
        console.log("Portfolio JavaScript loaded.");

        /* =================================================
           NAVBAR ACTIVE LINK
        ================================================= */

        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll("nav a");

        function updateActiveLink() {
            let currentSection = "";

            sections.forEach(function (section) {
                if (window.scrollY >= section.offsetTop - 140) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach(function (link) {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + currentSection
                );
            });
        }

        window.addEventListener("scroll", updateActiveLink);
        updateActiveLink();

        /* =================================================
           SMOOTH SCROLL
        ================================================= */

        navLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const href = link.getAttribute("href");

                if (!href || !href.startsWith("#")) {
                    return;
                }

                const target = document.querySelector(href);

                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            });
        });

        /* =================================================
           SCROLL REVEAL
        ================================================= */

        const animatedElements = document.querySelectorAll(
            ".skill-card, .experience-card, .education-card, .certification-card"
        );

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("show");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.15 }
            );

            animatedElements.forEach(function (element) {
                element.classList.add("hidden");
                observer.observe(element);
            });
        } else {
            animatedElements.forEach(function (element) {
                element.classList.add("show");
            });
        }

        /* =================================================
           RESUME DOWNLOAD LOG
        ================================================= */

        document
            .querySelectorAll('a[href="assets/resume.pdf"]')
            .forEach(function (link) {
                link.addEventListener("click", function () {
                    console.log("Resume download started.");
                });
            });

        /* =================================================
           TERMINAL TEXT ROTATION
        ================================================= */

        const terminalLines = [
            "Azure | Kubernetes | Terraform",
            "Jenkins | Docker | Ansible",
            "DevSecOps | CI/CD | Git"
        ];

        let lineIndex = 0;

        function updateTerminal() {
            const outputs = document.querySelectorAll(".terminal-output");

            if (outputs.length >= 3) {
                outputs[0].textContent = terminalLines[lineIndex];

                outputs[1].textContent =
                    terminalLines[
                        (lineIndex + 1) % terminalLines.length
                    ];

                outputs[2].textContent =
                    terminalLines[
                        (lineIndex + 2) % terminalLines.length
                    ];
            }

            lineIndex = (lineIndex + 1) % terminalLines.length;
        }

        window.setInterval(updateTerminal, 3000);

        /* =================================================
           FOOTER YEAR
        ================================================= */

        document
            .querySelectorAll("footer p:first-child")
            .forEach(function (paragraph) {
                paragraph.textContent =
                    "© " + new Date().getFullYear() + " Pawan Singh";
            });

        /* =================================================
           AI CHATBOT ELEMENTS
        ================================================= */

        const chatToggle = document.getElementById("chat-toggle");
        const chatWindow = document.getElementById("chat-window");
        const chatClose = document.getElementById("chat-close");
        const chatForm = document.getElementById("chat-form");
        const chatInput = document.getElementById("chat-input");
        const chatMessages = document.getElementById("chat-messages");
        const chatSend = document.getElementById("chat-send");

        if (
            !chatToggle ||
            !chatWindow ||
            !chatClose ||
            !chatForm ||
            !chatInput ||
            !chatMessages ||
            !chatSend
        ) {
            console.error(
                "Chatbot initialization failed. Check chatbot IDs in index.html."
            );
            return;
        }

        /* =================================================
           OPEN CHAT
        ================================================= */

        function openChat() {
            chatWindow.classList.remove("chat-hidden");

            chatWindow.style.setProperty(
                "display",
                "flex",
                "important"
            );

            chatWindow.style.setProperty(
                "visibility",
                "visible",
                "important"
            );

            chatWindow.style.setProperty(
                "opacity",
                "1",
                "important"
            );

            chatWindow.style.setProperty(
                "z-index",
                "999999",
                "important"
            );

            chatWindow.setAttribute("aria-hidden", "false");
            chatToggle.setAttribute("aria-expanded", "true");

            chatInput.focus();
        }

        /* =================================================
           CLOSE CHAT
        ================================================= */

        function closeChat() {
            chatWindow.classList.add("chat-hidden");

            chatWindow.style.setProperty(
                "display",
                "none",
                "important"
            );

            chatWindow.setAttribute("aria-hidden", "true");
            chatToggle.setAttribute("aria-expanded", "false");
        }

        /* Start with chat window closed */
        closeChat();

        /* Open/close toggle button */
        chatToggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (chatWindow.classList.contains("chat-hidden")) {
                openChat();
            } else {
                closeChat();
            }
        });

        /* Close button */
        chatClose.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            closeChat();
        });

        /* =================================================
           DISPLAY CHAT MESSAGES
        ================================================= */

        function addChatMessage(message, type) {
            const element = document.createElement("div");

            element.className =
                type === "user" ? "user-message" : "bot-message";

            element.textContent = message;

            chatMessages.appendChild(element);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            return element;
        }

        /* =================================================
           SEND MESSAGE TO NETLIFY FUNCTION
        ================================================= */

        chatForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            event.stopPropagation();

            const message = chatInput.value.trim();

            if (!message || chatSend.disabled) {
                return;
            }

            addChatMessage(message, "user");

            chatInput.value = "";
            chatSend.disabled = true;
            chatSend.textContent = "Sending...";

            const loadingMessage = addChatMessage(
                "Thinking...",
                "bot"
            );

            try {
                const response = await fetch(
                    "/.netlify/functions/chat",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: message
                        })
                    }
                );

                
const responseText = await response.text();

let data = {};

try {
    data = responseText ? JSON.parse(responseText) : {};
} catch (parseError) {
    console.error("Invalid response from server:", responseText);
    throw new Error(
        `Server returned an invalid response (HTTP ${response.status}).`
    );
}

if (!response.ok) {
    throw new Error(
        data.error || `Chat request failed (HTTP ${response.status})`
    );
}


                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        `Chat request failed (${response.status})`
                    );
                }

                loadingMessage.textContent =
                    data.reply ||
                    "The assistant returned an empty response.";

            } catch (error) {
                console.error(
                    "Chatbot request failed:",
                    error
                );

                loadingMessage.textContent =
                    error.message ||
                    "Sorry, the request failed. Please try again.";

            } finally {
                chatSend.disabled = false;
                chatSend.textContent = "Send";
                chatInput.focus();
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

        console.log("AI chatbot initialized successfully.");
    }

    /* =====================================================
       INITIALIZE AFTER DOM IS READY
    ===================================================== */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializePortfolio
        );
    } else {
        initializePortfolio();
    }
})();
// Google Analytics: Portfolio Activity Tracking
document.addEventListener("DOMContentLoaded", () => {
  // Track clicks on resume download links/buttons
  document.querySelectorAll('a[href*="resume.pdf"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "resume_download", {
          event_category: "engagement",
          event_label: link.href
        });
      }
    });
  });

  // Track contact email clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "contact_click", {
          contact_method: "email"
        });
      }
    });
  });

  // Track chatbot open
  const chatToggle = document.getElementById("chat-toggle");

  if (chatToggle) {
    chatToggle.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "chatbot_open");
      }
    });
  }

  // Track chatbot messages
  const chatForm = document.getElementById("chat-form");

  if (chatForm) {
    chatForm.addEventListener("submit", () => {
      if (typeof gtag === "function") {
        gtag("event", "chatbot_message_sent");
      }
    });
  }
});