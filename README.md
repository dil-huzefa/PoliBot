📚 AI-Powered Policy Assistant Chatbot
A full-stack AI chatbot that helps users find answers from school board policy documents using the power of LangChain, Gemini (Google Generative AI), and Milvus vector DB. The frontend is built with React and Material UI, while the backend runs on FastAPI (Python).

✨ Features
Uploads & processes PDFs/DOCX files (school policy documents).

Splits data into chunks and stores it in Milvus (Zilliz Cloud) vector database.

Embeds text using Google Generative AI Embeddings.

Uses Gemini-2.0-flash model to answer questions based on context.

Fully functional React chatbot UI with floating assistant widget.

Persistent memory and contextual chat.

Responsive, animated UI using Framer Motion.

📂 Project Structure
bash
Copy
Edit
📦 ai-policy-assistant
├── backend/
│   ├── main.py               # FastAPI server with LangChain logic
│   ├── .env                  # Contains API keys (excluded from version control)
│   ├── requirements.txt      # Python dependencies
│   └── documents/            # Folder for PDF and DOCX documents
├── frontend/
│   ├── src/components/
│   │   └── ChatBot.jsx       # Main chatbot UI
│   ├── App.js
│   └── assets/icon.png       # Custom avatar/icon
🚀 Backend Setup (FastAPI + LangChain + Milvus)
📦 Requirements
Python 3.9+

Milvus/Zilliz Cloud account

Google Generative AI API key

📁 Install Dependencies
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
📄 .env Example (Optional)
env
Copy
Edit
GOOGLE_API_KEY=your_google_api_key_here
MILVUS_URI=https://your-zilliz-cloud-uri
MILVUS_TOKEN=your_zilliz_token
▶️ Run Backend Server
bash
Copy
Edit
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
API will be live at: http://localhost:8000

✅ FastAPI Endpoints
GET / - Check if the server is running.

POST /chat - Accepts a JSON with a question key and returns an AI-generated answer based on vector search.

🌐 Frontend Setup (React + Material UI)
📁 Install Dependencies
bash
Copy
Edit
cd frontend
npm install
▶️ Run Frontend
bash
Copy
Edit
npm start
Make sure backend is running at http://localhost:8000. Adjust the fetch URL in your React code if using a different backend port or host.

💡 How It Works
On startup, the backend loads PDF/DOCX documents and splits them into ~1000 token chunks.

Embeddings are generated using Google Generative AI Embeddings.

These embeddings are stored in Milvus vector DB (Zilliz Cloud).

When a user asks a question, the chatbot:

Retrieves the top k=3 relevant document chunks from Milvus.

Passes context + user question to Gemini LLM.

Returns the LLM response to the React UI.

🛡️ Tech Stack
🔧 Backend
FastAPI – RESTful Python server

LangChain – Document chunking, embeddings, prompt chaining

Google Generative AI – Embeddings + Gemini model

Milvus (Zilliz Cloud) – Vector DB for similarity search

Unstructured, PyPDFLoader – Document parsing (PDF/DOCX)

🎨 Frontend
React – UI framework

Material UI (MUI) – Prebuilt components & theming

Framer Motion – Smooth animations

Fetch API – Communicates with backend API

📷 UI Preview
<img src="https://via.placeholder.com/600x300?text=Chatbot+UI+Preview" alt="Chatbot Preview" />
🛠️ Future Enhancements
User authentication for file uploads

Admin dashboard for document management

Chat history and session persistence

Support for additional file types (.txt, .html)

👨‍💻 Author
Huzefa Khan