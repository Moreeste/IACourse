from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Parte 1 Carga de data
# 1. Carga de documento
loader = TextLoader("document.txt", encoding="utf-8")
docs = loader.load()

# 2. Dividir en chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 500,
    chunk_overlap = 50
)

splits = text_splitter.split_documents(docs)