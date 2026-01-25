from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks):
    """
    Convert text chunks into embedding vectors
    """
    return model.encode(chunks).tolist()
