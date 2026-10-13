# 🎥 YouTube RAG Assistant

A full-stack AI application combining a **FastAPI backend** and a **Google Chrome Extension (Manifest V3)** that enables interactive **Retrieval-Augmented Generation (RAG)** over YouTube video transcripts. Ask questions in real-time about any video you are watching and get accurate, context-grounded answers.

---

## 🚀 Features

- **Floating In-Page Chat Widget**: An interactive `🤖 Ask AI` button and chat panel injected directly into the YouTube player page.
- **Chrome Extension Toolbar Popup**: Clean popup UI accessible directly from your browser's toolbar.
- **Automatic Video Navigation Detection**: Monitors YouTube's Single Page Application (SPA) navigation and automatically loads transcripts when you switch videos.
- **Smart Transcript Handling**: Prefers English and human-uploaded subtitles before falling back to auto-generated subtitles using `youtube-transcript-api`.
- **Fast Local Embeddings & Vector Search**: Chunks text via `RecursiveCharacterTextSplitter` and computes dense embeddings locally using `sentence-transformers/all-MiniLM-L6-v2` stored in an in-memory `FAISS` index.
- **Hallucination Guardrails**: The LLM prompt strictly grounds answers within the retrieved context chunks and safely admits when information is not covered by the video.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn
- **AI / LLM Orchestration**: LangChain, LangChain Core, LangChain Community, LangChain Hugging Face
- **Embeddings & Vector Store**: `sentence-transformers/all-MiniLM-L6-v2`, FAISS (Facebook AI Similarity Search)
- **Model Inference**: Hugging Face Inference API (`ChatHuggingFace` / `HuggingFaceEndpoint`)
- **Frontend**: Chrome Extension (Manifest V3), HTML5, CSS3, Vanilla JavaScript

---

## 📂 Project Structure

```text
youtube-rag-extension/
├── extension/                  # Chrome Extension (Manifest V3)
│   ├── manifest.json           # Extension permissions and metadata
│   ├── content.js              # In-page overlay widget & URL change watcher
│   ├── popup.html              # Extension toolbar popup layout
│   └── popup.js                # Toolbar popup interaction logic
├── main.py                     # FastAPI REST API endpoints & CORS setup
├── youtube.py                  # Core RAG pipeline (transcripts, embeddings, FAISS, LCEL)
├── test_youtube.py             # CLI test script to verify RAG on a sample video
├── requirements.txt            # Python dependencies
├── .env.example                # Example environment variables template
├── .env                        # Local environment variables (ignored by git)
└── README.md                   # Project documentation
```

---

## ⚙️ Prerequisites

1. **Python 3.10+** installed on your system.
2. **Google Chrome** (or any Chromium-based browser like Brave, Edge, Opera).
3. A **Hugging Face API Token** (free account token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)).

---

## 📥 Installation & Setup

### 1. Clone & Set Up Python Environment

```bash
# Clone the repository (if applicable) or navigate to the directory
cd youtube-rag-extension

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (cmd):
.\venv\Scripts\activate.bat
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the example environment file and add your token:

```bash
# On Windows (PowerShell):
Copy-Item .env.example .env

# On macOS/Linux:
cp .env.example .env
```

Open `.env` and set your Hugging Face API key:

```env
HF_TOKEN="your_huggingface_api_token_here"
```

---

## 🚀 Running the Project

### Step 1: Start the FastAPI Backend

Run the server using Uvicorn:

```bash
uvicorn main:app --reload --port 8000
```

The backend will start at `http://127.0.0.1:8000`. You can test it by visiting:
- Health check: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Step 2: Install the Chrome Extension

1. Open your browser and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** on (top-right corner).
3. Click **Load unpacked** (top-left).
4. Select the `extension` folder located inside this project (`youtube-rag-extension/extension`).
5. The **YouTube RAG Assistant** icon should now appear in your browser extensions list.

---

## 💡 How to Use

1. Ensure the FastAPI backend is running on port `8000`.
2. Open any video on [YouTube](https://www.youtube.com) (make sure captions/subtitles are available for the video).
3. **Using the In-Page Widget**:
   - Look at the bottom-right corner of the YouTube page for the floating **"🤖 Ask AI"** button.
   - Click it to toggle the chat panel.
   - Wait until it displays `✓ Video ready`.
   - Enter your question in the input box and click **Ask**.
4. **Using the Extension Toolbar**:
   - Click the extension icon in your Chrome toolbar.
   - Click **"📺 Load Current Video"**.
   - Type your question and click **"✨ Ask Question"**.

---

## 📡 API Endpoints

| Method | Endpoint | Query Param | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | None | Health check endpoint. |
| `POST` | `/load-video` | `url` (string) | Fetches the video transcript, chunks it, generates embeddings, and creates the FAISS vector index. |
| `POST` | `/ask` | `question` (string) | Queries the active video's vector store and generates an answer using the LLM. |

---

## 🧪 Testing Locally via CLI

You can verify the RAG pipeline directly without opening the browser:

```bash
python test_youtube.py
```

This script loads a sample YouTube video, extracts its transcript, creates the FAISS index, and asks `"What is this video about?"`.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

