from urllib.parse import urlparse, parse_qs

from youtube_transcript_api import YouTubeTranscriptApi
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from dotenv import load_dotenv

load_dotenv()

def extract_video_id(url):
    parsed_url = urlparse(url)

    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        return parse_qs(parsed_url.query).get("v", [None])[0]

    if parsed_url.hostname == "youtu.be":
        return parsed_url.path.strip("/")

    return None

def get_transcript(video_id):
    api = YouTubeTranscriptApi()

    transcript_list = api.list(video_id)

    transcripts = list(transcript_list)

    if not transcripts:
        raise Exception("No transcript available for this video")

    # 1. Prefer English
    for transcript in transcripts:
        if transcript.language_code == "en":
            selected_transcript = transcript
            break

    else:
        # 2. Prefer manually created transcript
        for transcript in transcripts:
            if not transcript.is_generated:
                selected_transcript = transcript
                break

        else:
            # 3. Otherwise use the first available transcript
            selected_transcript = transcripts[0]

    print(
        f"Using transcript: "
        f"{selected_transcript.language} "
        f"({selected_transcript.language_code})"
    )

    fetched_transcript = selected_transcript.fetch()

    text = " ".join(
        snippet.text
        for snippet in fetched_transcript
    )

    return text

def split_transcript(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.create_documents([text])

    return chunks

def create_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    return embeddings

def create_vector_store(chunks, embeddings):
    vector_store = FAISS.from_documents(
        chunks,
        embeddings
    )

    return vector_store

def create_retriever(vector_store):
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )

    return retriever

def create_llm():
    llm = HuggingFaceEndpoint(
        repo_id="openai/gpt-oss-120b:fastest",
        task="text-generation"
    )

    model = ChatHuggingFace(llm=llm)

    return model

def create_prompt():
    prompt = PromptTemplate(
        template="""
            You are a helpful AI assistant.

            Answer the question using only the provided context from the YouTube video.

            If the answer cannot be found in the context, say:
            "I don't know based on the video."

            Context:
            {context}

            Question:
            {question}

            Answer:
            """,
        input_variables=["context", "question"]
    )

    return prompt

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def create_rag_chain(retriever):
    model = create_llm()
    prompt = create_prompt()
    parser = StrOutputParser()

    parallel_chain = RunnableParallel({
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough()
    })

    main_chain = parallel_chain | prompt | model | parser

    return main_chain