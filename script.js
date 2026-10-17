// Select HTML elements
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

const scratchBox = document.getElementById("scratchBox");
const hint = document.getElementById("hint");
const revealBtn = document.getElementById("revealBtn");
const detailsBtn = document.getElementById("detailsBtn");
const languageBtn = document.getElementById("languageBtn");

let isScratching = false;
let isRevealed = false;

// Draw the scratch cover
function drawCover() {
    if (isRevealed) return;

    const rect = scratchBox.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = ctx.createLinearGradient(
        0, 0, rect.width, rect.height
    );

    gradient.addColorStop(0, "#d7c7d0");
    gradient.addColorStop(0.5, "#f7e8ed");
    gradient.addColorStop(1, "#bca6b4");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "#86536b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 15px Arial";
    ctx.fillText(
        "SCRATCH TO REVEAL ♥",
        rect.width / 2,
        rect.height / 2
    );
}

// Remove the cover using the mouse or finger
function scratch(event) {
    if (!isScratching || isRevealed) return;

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    checkProgress();
}

// Check how much of the cover has been scratched
function checkProgress() {
    const pixels = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    ).data;

    let transparent = 0;
    let total = 0;

    // Sample pixels to improve performance
    for (let i = 3; i < pixels.length; i += 4 * 8) {
        total++;

        if (pixels[i] < 20) {
            transparent++;
        }
    }

    if (total > 0 && transparent / total > 0.40) {
        revealInvitation();
    }
}

// Reveal the invitation
function revealInvitation() {
    if (isRevealed) return;

    isRevealed = true;
    scratchBox.classList.add("revealed");

    hint.textContent =
        "You discovered our special day! ♥";
}

// Mouse and touch interactions
canvas.addEventListener("pointerdown", function(event) {
    if (isRevealed) return;

    isScratching = true;
    canvas.setPointerCapture(event.pointerId);
    scratch(event);
    event.preventDefault();
});

canvas.addEventListener("pointermove", scratch);

canvas.addEventListener("pointerup", function() {
    isScratching = false;
});

canvas.addEventListener("pointercancel", function() {
    isScratching = false;
});

// Reveal button
revealBtn.addEventListener("click", revealInvitation);

// Scroll to the wedding details
detailsBtn.addEventListener("click", function() {
    document.getElementById("details").scrollIntoView({
        behavior: "smooth"
    });
});

// English and Urdu language toggle
let isUrdu = false;

languageBtn.addEventListener("click", function() {
    isUrdu = !isUrdu;

    document.body.classList.toggle("urdu-mode", isUrdu);
    document.documentElement.lang = isUrdu ? "ur" : "en";

    document.getElementById("heading").textContent =
        isUrdu
            ? "آپ کے لیے ایک سرپرائز ہے!"
            : "A Surprise Is Waiting For You!";

    hint.textContent = isUrdu
        ? "دل پر انگلی یا ماؤس سے اسکریچ کریں۔"
        : "Use your finger or mouse to scratch the heart.";

    languageBtn.textContent = isUrdu
        ? "English / اردو"
        : "اردو / English";

    // Update the scratch cover language
    if (!isRevealed) {
        drawCover();
    }
});

// RSVP form
const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document
        .getElementById("guestName")
        .value.trim();

    const attendance = document.getElementById("attendance").value;
    const message = document.getElementById("message");

    if (name === "") {
        message.textContent = "Please enter your name.";
        return;
    }

    if (attendance === "yes") {
        message.textContent = isUrdu
            ? `شکریہ ${name}! ہمیں خوشی ہوگی کہ آپ آئیں گے۔`
            : `Thank you, ${name}! We are happy you can join us.`;
    } else {
        message.textContent = isUrdu
            ? `جواب دینے کا شکریہ، ${name}۔`
            : `Thank you for responding, ${name}. You will be missed!`;
    }

    rsvpForm.reset();
});

// Set the correct canvas size
window.addEventListener("resize", drawCover);

drawCover();