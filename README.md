# 🌸 Onboardly — AI Onboarding Assistant

An AI-powered employee onboarding assistant built with Spring Boot,
React, Spring AI, Ollama and PGVector.

Employees can upload company documents and ask natural-language
questions. The assistant retrieves relevant information using semantic
search and generates answers grounded in the uploaded knowledge base.

## ✨ Features

- AI-powered employee onboarding chatbot
- Retrieval-Augmented Generation (RAG)
- PDF document ingestion
- Semantic document search
- Local LLM inference using Ollama
- Local embeddings using nomic-embed-text
- PostgreSQL + PGVector vector storage
- React dashboard
- Animated assistant interface
- Source metadata stored with document chunks

## 📸 Preview

![Onboardly Dashboard](screenshots/dashboard.png)

## 🏗 Architecture

React
↓
Spring Boot REST API
↓
Spring AI
├── PGVector similarity search
│       ↑
│   nomic-embed-text
│
└── Llama 3.2 via Ollama
↓
Grounded Answer

Document ingestion:

PDF
↓
Spring AI PDF Reader
↓
TokenTextSplitter
↓
nomic-embed-text
↓
PGVector

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring AI
- Maven

### Frontend
- React
- Vite
- Lucide React

### AI
- Ollama
- Llama 3.2
- nomic-embed-text

### Database
- PostgreSQL
- PGVector
- Docker Compose

## 🚀 Running Locally

### Prerequisites

Install:

- Java 17+
- Node.js / npm
- Docker
- Ollama

### 1. Clone the repository

git clone <repository-url>
cd onboarding-assistant

### 2. Download the AI models

ollama pull llama3.2
ollama pull nomic-embed-text

Verify:

ollama list

### 3. Start PostgreSQL + PGVector

docker compose up -d

Verify:

docker ps

### 4. Enable PGVector

docker exec -it onboarding-postgres psql -U onboarding -d onboarding

Then:

CREATE EXTENSION IF NOT EXISTS vector;

Exit:

\q

### 5. Start the Spring Boot backend

./mvnw spring-boot:run

Backend:

http://localhost:8080

### 6. Start React

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173

## 💬 Example

Upload an onboarding PDF through the Knowledge Base.

Then ask:

> How do I request VPN access?

The application performs semantic retrieval against the uploaded
documents and provides a response grounded in the retrieved context.

## 🗺 Roadmap

- [x] Local LLM integration
- [x] React chatbot
- [x] PGVector integration
- [x] Semantic search
- [x] RAG
- [x] PDF upload
- [ ] Persistent document metadata
- [ ] Source citations in chat responses
- [ ] Document deletion
- [ ] Authentication and authorization
- [ ] User-specific onboarding experience
- [ ] Conversation history
- [ ] Deployment

## 👩‍💻 Author

Kajal