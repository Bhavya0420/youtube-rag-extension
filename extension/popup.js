const backend = "http://127.0.0.1:8000";

let videoLoaded = false;


document.getElementById("loadVideo").addEventListener("click", async () => {
    const status = document.getElementById("status");

    status.textContent = "Loading video...";

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const url = tabs[0].url;

    if (!url || !url.includes("youtube.com/watch")) {
        status.textContent = "Please open a YouTube video first.";
        return;
    }

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
            return;
        }

        videoLoaded = true;

        status.textContent = "Video loaded successfully!";
    } catch (error) {
        status.textContent = "Could not connect to backend.";
        console.error(error);
    }
});


document.getElementById("ask").addEventListener("click", async () => {
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer");

    if (!videoLoaded) {
        answer.textContent = "Please load the video first.";
        return;
    }

    if (!question.trim()) {
        answer.textContent = "Please enter a question.";
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
        answer.textContent = "Could not connect to backend.";
        console.error(error);
    }
});