# 🎥 YouTube RAG Assistant

A Chrome extension that allows users to ask questions about a YouTube video and get answers based on the video's transcript.

This project uses **LangChain, Retrieval-Augmented Generation (RAG), FAISS, Hugging Face, FastAPI, and Chrome Extension APIs** to build an end-to-end AI application.

## 🚀 Features

- 🎥 Load a YouTube video
- 📝 Extract the video's transcript
- ✂️ Split the transcript into smaller chunks
- 🔢 Generate embeddings for transcript chunks
- 🔎 Retrieve relevant information using FAISS
- 🤖 Generate answers using an LLM
- 💬 Ask questions about the video
- ⚡ FastAPI backend
- 🌐 Chrome extension interface
- 🚫 Handles videos without available subtitles

## 🏗️ Architecture

```text
YouTube Video
      │
      ▼
YouTube Transcript
      │
      ▼
Text Splitting
      │
      ▼
Embeddings
      │
      ▼
FAISS Vector Store
      │
      ▼
Retriever
      │
      ▼
Relevant Context
      │
      ▼
Prompt
      │
      ▼
LLM
      │
      ▼
Answer
      │
      ▼
Chrome Extension
```

## 🛠️ Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn

### AI / RAG

- LangChain
- Hugging Face
- FAISS
- Sentence Transformers
- YouTube Transcript API

### Frontend

- HTML
- CSS
- JavaScript
- Chrome Extension APIs

## 📁 Project Structure

```text
youtube-rag-extension/
│
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── ...
│
├── main.py
├── youtube.py
├── test_youtube.py
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Bhavya0420/youtube-rag-extension.git
cd youtube-rag-extension
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
HUGGINGFACEHUB_API_TOKEN=your_huggingface_api_key
```

Replace `your_huggingface_api_key` with your Hugging Face API key.

**Never commit your `.env` file to GitHub.**

## ▶️ Run the Backend

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8000/docs
```

## 🧩 Load the Chrome Extension

1. Open Google Chrome.
2. Navigate to:

```text
chrome://extensions/
```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project's `extension/` folder.
6. Open a YouTube video.
7. Use the extension to load the video.
8. Ask questions about the video.

## 🔄 How RAG Works

The application follows a Retrieval-Augmented Generation pipeline.

### 1. Extract Transcript

The application retrieves the available transcript from the YouTube video.

### 2. Split the Transcript

The transcript is divided into smaller chunks using a text splitter.

### 3. Create Embeddings

Each chunk is converted into a vector representation using a sentence-transformer embedding model.

### 4. Store Embeddings

The embeddings are stored in a FAISS vector database.

### 5. Retrieve Relevant Context

When the user asks a question, the retriever searches the vector store and finds the most relevant transcript chunks.

### 6. Augment the Prompt

The retrieved transcript content is provided as context to the LLM.

### 7. Generate the Answer

The LLM generates an answer based on the retrieved context from the YouTube video.

```text
User Question
      │
      ▼
Retriever
      │
      ▼
Relevant Transcript Chunks
      │
      ▼
Context + Question
      │
      ▼
Prompt
      │
      ▼
LLM
      │
      ▼
Answer
```

## 🔌 API Endpoints

### `GET /`

Checks whether the backend is running.

### `POST /load-video`

Loads a YouTube video, retrieves its transcript, creates embeddings, builds the FAISS vector store, and prepares the RAG pipeline.

Example:

```text
POST /load-video?url=YOUTUBE_VIDEO_URL
```

### `POST /ask`

Asks a question about the currently loaded video.

Example:

```text
POST /ask?question=What is this video about?
```

## ⚠️ Limitations

- The YouTube video must have an accessible transcript or subtitle.
- Videos with subtitles disabled cannot currently be processed.
- The backend needs to be running locally.
- The application currently processes one loaded video at a time.
- LLM availability and API limits depend on the Hugging Face model/provider being used.

## 🔮 Future Improvements
- [ ] Improve the Chrome extension UI
- [ ] Support more transcript languages
- [ ] Add conversation history
- [ ] Allow users to switch between videos easily
- [ ] Improve error handling
- [ ] Deploy the backend to the cloud
- [ ] Add streaming responses
- [ ] Add video summarization
- [ ] Add timestamp-based answers

## 📚 What I Learned

Through this project, I explored and implemented:

- Retrieval-Augmented Generation (RAG)
- LangChain Runnable pipelines
- Prompt templates
- Embeddings
- Vector databases
- FAISS similarity search
- YouTube transcript extraction
- FastAPI APIs
- Chrome Extension development
- Connecting an AI backend with a frontend

## 👩‍💻 Author

**Bhavya Sree Manam**

Built as a learning project while exploring **LangChain, RAG, and Agentic AI**.

## ⭐ Acknowledgements

This project was built as part of my learning journey into **Generative AI, LangChain, RAG, and AI-powered applications**.
