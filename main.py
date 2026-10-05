from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api._errors import TranscriptsDisabled

from youtube import (
    extract_video_id,
    get_transcript,
    split_transcript,
    create_embeddings,
    create_vector_store,
    create_retriever,
    create_rag_chain
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

retriever = None
rag_chain = None


@app.get("/")
def home():
    return {
        "message": "YouTube RAG backend is working!"
    }


@app.post("/load-video")
def load_video(url: str):
    global retriever, rag_chain

    video_id = extract_video_id(url)

    if not video_id:
        return {
            "error": "Invalid YouTube URL"
        }

    try:
        text = get_transcript(video_id)

    except TranscriptsDisabled:
        return {
            "error": "This video does not have subtitles. Please try another video."
        }

    chunks = split_transcript(text)
    embeddings = create_embeddings()
    vector_store = create_vector_store(chunks, embeddings)
    retriever = create_retriever(vector_store)
    rag_chain = create_rag_chain(retriever)

    return {
        "message": "Video loaded successfully",
        "video_id": video_id
    }


@app.post("/ask")
def ask_question(question: str):
    if rag_chain is None:
        return {
            "error": "Please load a video first"
        }

    answer = rag_chain.invoke(question)

    return {
        "question": question,
        "answer": answer
    }