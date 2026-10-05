from youtube import (
    extract_video_id,
    get_transcript,
    split_transcript,
    create_embeddings,
    create_vector_store,
    create_retriever,
    create_rag_chain
)


url = "https://www.youtube.com/watch?v=Gfr50f6ZBvo"

video_id = extract_video_id(url)

text = get_transcript(video_id)

chunks = split_transcript(text)

embeddings = create_embeddings()

vector_store = create_vector_store(
    chunks,
    embeddings
)

retriever = create_retriever(vector_store)

rag_chain = create_rag_chain(retriever)

question = "What is this video about?"

answer = rag_chain.invoke(question)

print("\nAnswer:")
print(answer)