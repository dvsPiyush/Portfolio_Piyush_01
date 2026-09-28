/* ================================================================
   1. MOBILE MENU
   ================================================================ */

const menuButton = document.querySelector("#menu-icon");
const navLinks = document.querySelector(".nav-links");
const menuIcon = menuButton.querySelector("i");

function openMenu() {
    navLinks.classList.add("active");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");
    menuIcon.classList.replace("fa-bars", "fa-xmark");
}

function closeMenu() {
    navLinks.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuIcon.classList.replace("fa-xmark", "fa-bars");
}

// Hamburger button toggles the menu.
menuButton.addEventListener("click", function () {
    if (navLinks.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close the menu after choosing a link.
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
});

// Close with the Escape key.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// Close when clicking anywhere outside the header.
document.addEventListener("click", function (event) {
    if (!event.target.closest(".header")) {
        closeMenu();
    }
});

// If the window grows past the mobile breakpoint, reset the menu.
window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});


/* ================================================================
   2. HIGHLIGHT THE NAV LINK OF THE SECTION ON SCREEN
   ================================================================ */

const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                links.forEach(function (link) {
                    link.classList.toggle(
                        "current",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            }
        });
    },
    // A section counts as "current" when it crosses the middle of the screen.
    { rootMargin: "-50% 0px -50% 0px" }
);

sections.forEach(function (section) {
    sectionObserver.observe(section);
});


/* ================================================================
   3. CONTACT FORM VALIDATION
   ================================================================ */

const form = document.querySelector("#contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const statusText = document.querySelector("#form-status");
const submitButton = form.querySelector(".submit-btn");

// Simple email pattern: something@something.something
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;gi

// Show an error under a field.
function showError(input, message) {
    clearError(input);

    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");

    const error = document.createElement("p");
    error.className = "field-error";
    error.textContent = message;

    // Put the message after the input's wrapper box.
    input.closest(".form-field").appendChild(error);
}

// Remove the error from a field.
function clearError(input) {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");

    const old = input.closest(".form-field").querySelector(".field-error");
    if (old) {
        old.remove();
    }
}

// Show a message in the status area (type is "success" or "error").
function setStatus(message, type) {
    statusText.textContent = message;
    statusText.className = "form-status " + (type || "");
}

// Check the three fields. Returns true only if all are valid.
function validateForm() {
    let isValid = true;
    let firstBad = null;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name.length < 2) {
        showError(nameInput, "Please enter your name (at least 2 characters).");
        firstBad = firstBad || nameInput;
        isValid = false;
    } else {
        clearError(nameInput);
    }

    if (email === "") {
        showError(emailInput, "Email is required.");
        firstBad = firstBad || emailInput;
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError(emailInput, "Please enter a valid email like name@example.com.");
        firstBad = firstBad || emailInput;
        isValid = false;
    } else {
        clearError(emailInput);
    }

    if (message.length < 10) {
        showError(messageInput, "Message should be at least 10 characters.");
        firstBad = firstBad || messageInput;
        isValid = false;
    } else {
        clearError(messageInput);
    }

    // Move the cursor to the first problem field.
    if (firstBad) {
        firstBad.focus();
    }

    return isValid;
}

// Remove a field's error as soon as the user starts fixing it.
[nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener("input", function () {
        clearError(input);
        setStatus("");
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    setStatus("");

    if (!validateForm()) {
        setStatus("Please fix the highlighted fields.", "error");
        return;
    }

    const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
    };

    // Disable the button so it can't be clicked twice.
    submitButton.disabled = true;
    setStatus("Sending...");

    // TODO: replace this block with a real request, for example:
    //   fetch("https://formspree.io/f/YOUR_ID", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(data)
    //   })
    // Until then, this only pretends to send.
    console.log("Form data ready to send:", data);

    setTimeout(function () {
        submitButton.disabled = false;
        form.reset();
        setStatus("Thanks! Your message is ready (demo: not actually sent yet).", "success");
    }, 800);
});