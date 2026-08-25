# 🌸 Onboardly — AI-Powered Employee Onboarding Assistant

Onboardly is a full-stack **AI-powered employee onboarding assistant** built using **Java, Spring Boot, Spring AI, React, Ollama, PostgreSQL, and PGVector**.

The application allows employees to upload internal onboarding documents and ask natural-language questions. It uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from the uploaded knowledge base and generate answers grounded in company documentation.

> The project runs completely locally using Ollama, so no paid LLM API is required.

---

## 📸 Application Preview

![Onboardly Dashboard](screenshots/dashboard.png)

---

## ✨ Features

- 💬 AI-powered onboarding chatbot
- 📄 PDF document upload and ingestion
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔎 Semantic similarity search
- 🗄 PostgreSQL + PGVector vector storage
- 🤖 Local LLM inference using Ollama
- 🔢 Local embeddings using `nomic-embed-text`
- ✂️ Automatic document chunking
- 🏷 Document metadata stored with vector chunks
- ⚛️ React + Vite frontend
- 🌸 Responsive pastel dashboard
- ⏳ Animated AI response and document-processing states
- 🔒 Grounded prompting to reduce hallucinated company policies

---

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │   React + Vite   │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                              REST APIs
                                  │
                         ┌────────▼─────────┐
                         │   Spring Boot    │
                         │     Backend      │
                         └────────┬─────────┘
                                  │
                              Spring AI
                         ┌────────┴─────────┐
                         │                  │
                  ┌──────▼──────┐    ┌─────▼──────┐
                  │  PGVector   │    │   Ollama   │
                  │ Similarity  │    │ Llama 3.2  │
                  │   Search    │    │ Chat Model │
                  └──────▲──────┘    └─────▲──────┘
                         │                  │
                  ┌──────┴────────┐         │
                  │ nomic-embed-  │         │
                  │     text      │         │
                  └───────────────┘         │
                                           │
                              Grounded Response
                                           │
                         ┌─────────────────▼┐
                         │      React       │
                         │    Chat UI       │
                         └──────────────────┘
```

---

## 📄 Document Ingestion Flow

When an onboarding document is uploaded:

```text
PDF Upload
    │
    ▼
Spring Boot Multipart API
    │
    ▼
Spring AI PDF Reader
    │
    ▼
Extracted Text
    │
    ▼
TokenTextSplitter
    │
    ▼
Document Chunks
    │
    ▼
nomic-embed-text
    │
    ▼
Vector Embeddings
    │
    ▼
PostgreSQL + PGVector
```

When an employee asks a question:

```text
Employee Question
       │
       ▼
Question Embedding
       │
       ▼
PGVector Similarity Search
       │
       ▼
Top Relevant Document Chunks
       │
       ▼
Context + Employee Question
       │
       ▼
Llama 3.2
       │
       ▼
Grounded Answer
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot |
| AI Integration | Spring AI |
| Frontend | React, Vite |
| LLM | Llama 3.2 |
| LLM Runtime | Ollama |
| Embeddings | nomic-embed-text |
| Vector Database | PostgreSQL + PGVector |
| Infrastructure | Docker, Docker Compose |
| Build | Maven, npm |

---

## 📂 Project Structure

```text
onboarding-assistant/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/kajal/onboarding_assistant/
│       │       ├── controller/
│       │       ├── service/
│       │       └── OnboardingAssistantApplication.java
│       │
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── WelcomeCard.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── DocumentPanel.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   └── package.json
│
├── screenshots/
│   └── dashboard.png
│
├── docker-compose.yml
├── pom.xml
└── README.md
```

---

# 🚀 Running the Project Locally

## Prerequisites

Make sure the following are installed:

- Java 17+
- Maven
- Node.js
- npm
- Docker Desktop
- Ollama

---

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd onboarding-assistant
```

---

## 2. Download the local AI models

The application uses separate models for text generation and embeddings.

```bash
ollama pull llama3.2
```

Then:

```bash
ollama pull nomic-embed-text
```

Verify:

```bash
ollama list
```

You should see both models.

---

## 3. Start PostgreSQL + PGVector

```bash
docker compose up -d
```

Verify the container:

```bash
docker ps
```

The project maps:

```text
localhost:5433 → PostgreSQL container:5432
```

Port `5433` is used on the host to avoid conflicts with an existing local PostgreSQL installation.

---

## 4. Enable PGVector

Connect to PostgreSQL:

```bash
docker exec -it onboarding-postgres psql -U onboarding -d onboarding
```

Run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Verify:

```sql
SELECT extname, extversion
FROM pg_extension
WHERE extname = 'vector';
```

Exit:

```text
\q
```

---

## 5. Start the Spring Boot backend

From the project root:

```bash
./mvnw spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

## 6. Start the React frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 💬 Using Onboardly

### Step 1 — Upload knowledge

Open the **Knowledge Base** panel and upload a PDF containing company onboarding information.

Onboardly will:

1. Extract the PDF text
2. Split the content into chunks
3. Generate embeddings
4. Store the vectors in PGVector

### Step 2 — Ask questions

For example:

```text
How do I request VPN access?
```

The application searches the vector database for relevant document chunks and provides those chunks as context to the LLM.

Instead of relying only on the LLM's general knowledge, the answer is generated using the uploaded company documentation.

---

## 🔌 Current APIs

### Chat

```http
GET /api/chat?message=How do I get VPN access?
```

### Upload Document

```http
POST /api/documents/upload
Content-Type: multipart/form-data
```

Form field:

```text
file = <PDF>
```

### Semantic Search

```http
GET /api/knowledge/search?question=How do I access the company network?
```

---

## 🧠 Why RAG?

A general-purpose LLM does not know an organization's internal policies, onboarding procedures, access processes, or documentation.

Onboardly combines an LLM with an organization's knowledge base using **Retrieval-Augmented Generation**.

This allows the application to retrieve relevant internal information before generating an answer.

The system prompt also instructs the model not to invent company policies when relevant information cannot be retrieved.

---

## 🔐 Local-First AI

The current implementation uses Ollama instead of an external hosted LLM API.

This provides:

- No per-request LLM API cost during local development
- Local model execution
- Local embedding generation
- Easier experimentation with different open models

The architecture can later be extended to hosted models such as OpenAI or other Spring AI-supported providers.

---

## 🗺️ Roadmap

- [x] Spring Boot AI backend
- [x] React chatbot
- [x] Ollama integration
- [x] Local Llama 3.2 inference
- [x] Local embedding generation
- [x] PostgreSQL + PGVector
- [x] Semantic similarity search
- [x] RAG pipeline
- [x] PDF document ingestion
- [x] Document upload from React
- [ ] Persist uploaded-document metadata
- [ ] Display persisted documents after refresh
- [ ] Source citations in AI responses
- [ ] Delete/re-index documents
- [ ] Conversation history
- [ ] Authentication and authorization
- [ ] Role-based document access
- [ ] Personalized employee onboarding
- [ ] Dockerize backend and frontend
- [ ] Cloud deployment

---

## 👩‍💻 Author

**Kajal**

Built as a hands-on exploration of **Spring AI, Retrieval-Augmented Generation, local LLMs, vector databases, and full-stack AI application development**.