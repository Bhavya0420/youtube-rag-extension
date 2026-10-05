const backend = "http://127.0.0.1:8000";

let videoLoaded = false;
let loadingVideo = false;
let currentVideoUrl = window.location.href;


// ===============================
// AI BUTTON
// ===============================

const button = document.createElement("button");

button.innerHTML = "🤖 Ask AI";

Object.assign(button.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    zIndex: "999999",
    padding: "12px 18px",
    border: "none",
    borderRadius: "25px",
    background: "#4f46e5",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)"
});

document.body.appendChild(button);


// ===============================
// AI PANEL
// ===============================

const panel = document.createElement("div");

Object.assign(panel.style, {
    position: "fixed",
    bottom: "80px",
    right: "30px",
    width: "350px",
    background: "white",
    borderRadius: "18px",
    padding: "18px",
    zIndex: "999999",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    display: "none",
    fontFamily: "Arial, sans-serif"
});

panel.innerHTML = `
    <h2 style="
        margin: 0 0 5px 0;
        font-size: 20px;
        color: #1f2937;
    ">
        🤖 YouTube AI
    </h2>

    <p id="statusAI" style="
        margin: 0 0 15px 0;
        font-size: 13px;
        color: #6b7280;
    ">
        Loading video...
    </p>

    <input
        id="questionAI"
        placeholder="Ask something about the video..."
        style="
            width: 100%;
            padding: 11px;
            box-sizing: border-box;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            font-size: 14px;
            outline: none;
        "
    >

    <button
        id="askAI"
        disabled
        style="
            width: 100%;
            padding: 11px;
            margin-top: 10px;
            border: none;
            border-radius: 10px;
            background: #4f46e5;
            color: white;
            font-weight: 600;
            cursor: pointer;
        "
    >
        ✨ Ask
    </button>

    <h3 style="
        margin: 18px 0 7px 0;
        font-size: 15px;
        color: #1f2937;
    ">
        💡 Answer
    </h3>

    <div
        id="answerAI"
        style="
            background: #f5f6fb;
            padding: 11px;
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.5;
            color: #374151;
        "
    >
        Ask a question about this video.
    </div>
`;

document.body.appendChild(panel);


// ===============================
// OPEN / CLOSE PANEL
// ===============================

button.addEventListener("click", () => {

    if (panel.style.display === "none") {
        panel.style.display = "block";
    } else {
        panel.style.display = "none";
    }

});


// ===============================
// LOAD CURRENT VIDEO AUTOMATICALLY
// ===============================

async function loadCurrentVideo() {

    const url = window.location.href;

    if (!url.includes("youtube.com/watch")) {
        return;
    }

    if (loadingVideo) {
        return;
    }

    loadingVideo = true;
    videoLoaded = false;

    const status = document.getElementById("statusAI");
    const askButton = document.getElementById("askAI");

    status.textContent = "Loading video...";
    status.style.color = "#6b7280";

    askButton.disabled = true;
    askButton.style.opacity = "0.6";

    try {

        const response = await fetch(
            `${backend}/load-video?url=${encodeURIComponent(url)}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (data.error) {

            status.textContent = data.error;
            status.style.color = "#dc2626";

            loadingVideo = false;

            return;
        }

        videoLoaded = true;
        loadingVideo = false;

        status.textContent = "✓ Video ready";
        status.style.color = "#16a34a";

        askButton.disabled = false;
        askButton.style.opacity = "1";

    } catch (error) {

        console.error(error);

        status.textContent =
            "Could not connect to backend.";

        status.style.color = "#dc2626";

        loadingVideo = false;
    }
}


// ===============================
// ASK QUESTION
// ===============================

document
    .getElementById("askAI")
    .addEventListener("click", async () => {

        const question =
            document.getElementById("questionAI").value.trim();

        const answer =
            document.getElementById("answerAI");

        if (!videoLoaded) {

            answer.textContent =
                "Video is still loading. Please wait.";

            return;
        }

        if (!question) {

            answer.textContent =
                "Please enter a question.";

            return;
        }

        answer.textContent = "Thinking...";

        try {

            const response = await fetch(
                `${backend}/ask?question=${encodeURIComponent(question)}`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (data.error) {

                answer.textContent = data.error;

                return;
            }

            answer.textContent = data.answer;

        } catch (error) {

            console.error(error);

            answer.textContent =
                "Could not connect to backend.";
        }

    });


// ===============================
// DETECT YOUTUBE VIDEO CHANGES
// ===============================

setInterval(() => {

    const newUrl = window.location.href;

    if (
        newUrl !== currentVideoUrl &&
        newUrl.includes("youtube.com/watch")
    ) {

        currentVideoUrl = newUrl;

        loadCurrentVideo();
    }

}, 1000);


// ===============================
// INITIAL LOAD
// ===============================

loadCurrentVideo();