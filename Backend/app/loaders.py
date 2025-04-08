from langchain_community.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader
import os

def load_documents(file_paths):
    documents = []
    for path in file_paths:
        ext = os.path.splitext(path)[1].lower()
        try:
            if ext == ".pdf":
                loader = PyPDFLoader(path)
            elif ext in [".docx", ".doc"]:
                loader = UnstructuredWordDocumentLoader(path)
            else:
                print(f"Unsupported file type: {path}")
                continue
            docs = loader.load()
            for doc in docs:
                doc.metadata = {}
            documents.extend(docs)
        except Exception as e:
            print(f"Failed to load {path}: {str(e)}")
    return documents
