from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_chunks(documents):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return splitter.split_documents(documents)
