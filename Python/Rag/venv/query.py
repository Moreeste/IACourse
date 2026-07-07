from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA

CHROMA_DIR = "./chroma_db"

# 1. Embeddings
embeddings = OllamaEmbeddings(
    model = "nomic-embed-text"
)

# 2. Cargar vectordb desde disco
vectorstore = Chroma(
    persist_directory = CHROMA_DIR,
    embedding_function = embeddings
)

# 3. Modelo (LLM)
llm = Ollama(
    model = "qwen2.5:0.5b"
)

# 4. Cadena RAG
qa = RetrievalQA.from_chain_type(
    llm = llm,
    retriever = vectorstore.as_retriever()
)

# 5. Pregunta
query = "¿Cuál es la última tarea de la lista?"
result = qa.invoke({"query": query})
print(result["result"])