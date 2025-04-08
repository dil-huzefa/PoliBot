from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

def create_chain(vector_store):
    retriever = vector_store.as_retriever(search_kwargs={"k": 3, "score_threshold": 0.5})
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3, top_p=0.85)

    prompt = ChatPromptTemplate.from_template(
        """Use the following pieces of context to answer the question at the end.
        If you don't know the answer, say you don't know.
        Context: {context}
        Question: {question}
        Answer:"""
    )

    return (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )
