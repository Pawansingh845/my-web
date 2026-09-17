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