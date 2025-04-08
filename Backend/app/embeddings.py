from app.config import GOOGLE_API_KEY, MILVUS_URI, MILVUS_TOKEN
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Milvus

def create_embeddings(chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = Milvus.from_documents(
        chunks,
        embeddings,
        connection_args={"uri": MILVUS_URI, "token": MILVUS_TOKEN},
        collection_name="QuestionAnswer4",
        drop_old=True
    )
    return vector_store
