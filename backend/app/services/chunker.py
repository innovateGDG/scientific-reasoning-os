def chunk_text(text: str, size: int = 800, overlap: int = 200):
    """
    Break long text into overlapping chunks
    """
    chunks = []
    start = 0

    while start < len(text):
        chunks.append(text[start:start + size])
        start += size - overlap

    return chunks
