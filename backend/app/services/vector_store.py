import faiss
import numpy as np

DIMENSION = 384  # matches MiniLM
index = faiss.IndexFlatL2(DIMENSION)
stored_chunks = []

def store_vectors(chunks, vectors):
    """
    Store vectors in FAISS index
    """
    global stored_chunks

    vectors_np = np.array(vectors).astype("float32")
    index.add(vectors_np)
    stored_chunks.extend(chunks)

def search_vectors(query_vector, top_k=5):
    """
    Retrieve relevant chunks
    """
    query_np = np.array([query_vector]).astype("float32")
    distances, indices = index.search(query_np, top_k)

    return [stored_chunks[i] for i in indices[0]]
