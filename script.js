
/* =====================================================
   PAWAN SINGH - DEVOPS PORTFOLIO
   Complete JavaScript + AI Chatbot
===================================================== */

(function () {
    "use strict";

    function initializePortfolio() {
        console.log("Pawan Singh DevOps Portfolio Loaded");

        /* NAVBAR ACTIVE LINK */
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll("nav a");

        window.addEventListener("scroll", function () {
            let currentSection = "";

            sections.forEach(function (section) {
                const top = section.offsetTop - 120;
                const bottom = top + section.offsetHeight;

                if (window.scrollY >= top && window.scrollY < bottom) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach(function (link) {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + currentSection
                );
            });
        });

        /* SMOOTH SCROLL */
        navLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const href = this.getAttribute("href");

                if (!href || !href.startsWith("#") || href === "#") return;

                const target = document.querySelector(href);

                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });

        /* SCROLL REVEAL */
        const animatedElements = document.querySelectorAll(
            ".skill-card, .experience-card, .education-card, .certification-card"
        );

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            animatedElements.forEach(function (element) {
                element.classList.add("hidden");
                observer.observe(element);
            });
        } else {
            animatedElements.forEach(function (element) {
                element.classList.add("show");
            });
        }

        /* RESUME DOWNLOAD */
        document.querySelectorAll('a[href="assets/resume.pdf"]')
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    console.log("Resume download started");
                });
            });

        /* TERMINAL TYPING EFFECT */
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
                    terminalLines[(lineIndex + 1) % terminalLines.length];
                outputs[2].textContent =
                    terminalLines[(lineIndex + 2) % terminalLines.length];
            }

            lineIndex = (lineIndex + 1) % terminalLines.length;
        }

        window.setInterval(updateTerminal, 3000);

        /* CURRENT YEAR */
        document.querySelectorAll("footer p:first-child")
            .forEach(function (element) {
                element.textContent =
                    "© " + new Date().getFullYear() + " Pawan Singh";
            });

        /* AI CHATBOT */
        const chatToggle = document.getElementById("chat-toggle");
        const chatWindow = document.getElementById("chat-window");
        const chatClose = document.getElementById("chat-close");
        const chatForm = document.getElementById("chat-form");
        const chatInput = document.getElementById("chat-input");
        const chatMessages = document.getElementById("chat-messages");
        const chatSend = document.getElementById("chat-send");

        if (
            !chatToggle || !chatWindow || !chatClose ||
            !chatForm || !chatInput || !chatMessages || !chatSend
        ) {
            console.error(
                "Chatbot setup failed: Check all chatbot IDs in index.html."
            );
            return;
        }

        console.log("AI Chatbot initialized successfully.");

        /* OPEN / CLOSE CHAT */
        function openChat() {
            chatWindow.classList.remove("chat-hidden");
            chatWindow.style.display = "flex";
            chatWindow.setAttribute("aria-hidden", "false");
            chatInput.focus();
        }

        function closeChat() {
            chatWindow.classList.add("chat-hidden");
            chatWindow.style.display = "none";
            chatWindow.setAttribute("aria-hidden", "true");
        }

        // Ensure the chat starts closed
        closeChat();

        chatToggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (chatWindow.classList.contains("chat-hidden")) {
                openChat();
            } else {
                closeChat();
            }
        });

        chatClose.addEventListener("click", function (event) {
            event.preventDefault();
            closeChat();
        });

        /* ADD CHAT MESSAGE */
        function addChatMessage(message, type) {
            const element = document.createElement("div");
            element.className =
                type === "user" ? "user-message" : "bot-message";
            element.textContent = message;

            chatMessages.appendChild(element);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            return element;
        }

        /* SEND MESSAGE TO NETLIFY FUNCTION */
        chatForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const message = chatInput.value.trim();

            if (!message || chatSend.disabled) return;

            addChatMessage(message, "user");
            chatInput.value = "";
            chatSend.disabled = true;
            chatSend.textContent = "Sending...";

            const loadingMessage = addChatMessage("Thinking...", "bot");

            try {
                const response = await fetch("/.netlify/functions/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ message: message })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Chat request failed.");
                }

                loadingMessage.textContent =
                    data.reply || "No answer received.";

            } catch (error) {
                console.error("Chatbot request error:", error);

                loadingMessage.textContent =
                    "Sorry, I couldn't get an answer. Please try again.";
            } finally {
                chatSend.disabled = false;
                chatSend.textContent = "Send";
                chatInput.focus();
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }

    // Works whether this file loads before or after DOMContentLoaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializePortfolio);
    } else {
        initializePortfolio();
    }
})();


document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("chat-toggle");
    const panel = document.getElementById("chat-window");

    if (!button || !panel) {
        alert("Chatbot HTML element missing!");
        return;
    }

    button.onclick = function () {
        alert("Chat button click is working!");

        panel.classList.remove("chat-hidden");
        panel.style.setProperty("display", "flex", "important");
        panel.style.setProperty("visibility", "visible", "important");
        panel.style.setProperty("opacity", "1", "important");
        panel.style.setProperty("z-index", "999999", "important");
    };
});

