from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles  # ✅ Added import
from pydantic import BaseModel

import os

from app.loaders import load_documents
from app.splitter import split_chunks
from app.embeddings import create_embeddings
from app.chain import create_chain

# Constants
UPLOAD_DIR = "./docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Sample file paths to load initially
initial_files = [
    os.path.join(UPLOAD_DIR, file)
    for file in os.listdir(UPLOAD_DIR)
    if file.lower().endswith(('.pdf', '.docx')) and os.path.isfile(os.path.join(UPLOAD_DIR, file))
]

# Check files exist
for path in initial_files:
    print(f"Checking: {os.path.abspath(path)} => Exists? {os.path.exists(path)}")

# FastAPI App
app = FastAPI()

# ✅ Mount static files
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set specific domains in prod
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
    docs = load_documents(initial_files)
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

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()

    if ext not in [".pdf", ".docx"]:
        return JSONResponse(status_code=400, content={"error": "Only .pdf and .docx files are allowed"})

    save_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(save_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        return {"message": f"{filename} uploaded successfully."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/documents")
async def list_documents():
    try:
        files = os.listdir(UPLOAD_DIR)
        # ✅ Include full static URL path for direct access
        docs = [
            {
                "name": file,
                "url": f"/static/{file}"
            }
            for file in files if os.path.isfile(os.path.join(UPLOAD_DIR, file))
        ]
        return {"documents": docs}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/")
def root():
    files = os.listdir(UPLOAD_DIR)
    return {"documents": files}
