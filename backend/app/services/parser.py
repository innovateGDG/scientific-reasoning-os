import fitz  # PyMuPDF

def parse_pdf(file):
    """
    Extract text from a PDF file
    """
    doc = fitz.open(stream=file.file.read(), filetype="pdf")
    text = ""

    for page in doc:
        text += page.get_text()

    return text
