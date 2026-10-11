// =====================================================
// PAWAN SINGH - DEVOPS PORTFOLIO
// JAVASCRIPT
// =====================================================


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Pawan Singh DevOps Portfolio Loaded");

});


// ================= NAVBAR ACTIVE LINK =================

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll("nav a");


window.addEventListener("scroll", function () {

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 120;

        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection = section.getAttribute("id");

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

});


// ================= SMOOTH SCROLL =================

navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId =
            this.getAttribute("href");

        const target =
            document.querySelector(targetId);


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ================= SCROLL REVEAL =================

const animatedElements = document.querySelectorAll(
    ".skill-card, .experience-card, .education-card, .certification-card"
);


const observer = new IntersectionObserver(

    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },

    {
        threshold: 0.15
    }

);


animatedElements.forEach(function (element) {

    element.classList.add("hidden");

    observer.observe(element);

});


// ================= DOWNLOAD RESUME =================

const resumeButtons =
    document.querySelectorAll(
        'a[href="assets/resume.pdf"]'
    );


resumeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        console.log("Resume download started");

    });

});


// ================= TYPING EFFECT =================

const terminalLines = [
    "Azure | Kubernetes | Terraform",
    "Jenkins | Docker | Ansible",
    "DevSecOps | CI/CD | Git"
];


let lineIndex = 0;


function updateTerminal() {

    const terminalOutputs =
        document.querySelectorAll(
            ".terminal-output"
        );


    if (terminalOutputs.length >= 3) {

        terminalOutputs[0].textContent =
            terminalLines[lineIndex];

        terminalOutputs[1].textContent =
            terminalLines[
                (lineIndex + 1) %
                terminalLines.length
            ];

        terminalOutputs[2].textContent =
            terminalLines[
                (lineIndex + 2) %
                terminalLines.length
            ];

    }


    lineIndex++;

    if (
        lineIndex >=
        terminalLines.length
    ) {

        lineIndex = 0;

    }

}


setInterval(
    updateTerminal,
    3000
);


// ================= CURRENT YEAR =================

const yearElements =
    document.querySelectorAll(
        "footer p:first-child"
    );


yearElements.forEach(function (element) {

    element.textContent =
        "© " +
        new Date().getFullYear() +
        " Pawan Singh";

});


const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const chatClose = document.getElementById("chat-close");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const chatSend = document.getElementById("chat-send");

chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("chat-hidden");
  if (!chatWindow.classList.contains("chat-hidden")) {
    chatInput.focus();
  }
});

chatClose.addEventListener("click", () => {
  chatWindow.classList.add("chat-hidden");
});

function addChatMessage(message, type) {
  const element = document.createElement("div");
  element.className = type === "user" ? "user-message" : "bot-message";
  element.textContent = message;
  chatMessages.appendChild(element);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return element;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (!message || chatSend.disabled) return;

  addChatMessage(message, "user");
  chatInput.value = "";
  chatSend.disabled = true;
  chatSend.textContent = "...";

  const loading = addChatMessage("Thinking...", "bot");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Chat request failed.");
    }

    loading.textContent = data.reply || "No answer received.";
  } catch (error) {
    loading.textContent =
      "Sorry, I couldn't get an answer. Please try again.";
    console.error("Chatbot error:", error);
  } finally {
    chatSend.disabled = false;
    chatSend.textContent = "Send";
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
