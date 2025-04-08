from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from app.loaders import load_documents
from app.splitter import split_chunks
from app.embeddings import create_embeddings
from app.chain import create_chain

import os

file_paths = ["./docs/Huzefa.pdf", "./docs/BigPolicy.docx"]

for path in file_paths:
    abs_path = os.path.abspath(path)
    print(f"Checking: {abs_path} => Exists? {os.path.exists(abs_path)}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Note: Use specific origins in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

retrieval_chain = None

class Query(BaseModel):
    question: str

@app.on_event("startup")
async def startup_event():
    global retrieval_chain
    file_paths = ["./docs/Huzefa.pdf", "./docs/BigPolicy.docx"]
    docs = load_documents(file_paths)
    chunks = split_chunks(docs)
    vector_store = create_embeddings(chunks)
    retrieval_chain = create_chain(vector_store)

@app.post("/chat")
async def chat(query: Query):
    global retrieval_chain
    try:
        answer = retrieval_chain.invoke(query.question)
        return {"answer": answer}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/")
def root():
    return {"message": "LangChain Chat API is running!"}
