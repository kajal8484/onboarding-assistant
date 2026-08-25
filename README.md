# Onboardly — AI-Powered Employee Onboarding Assistant

Onboardly is a full-stack AI-powered employee onboarding assistant built with **Java, Spring Boot, Spring AI, React, Ollama, PostgreSQL, and PGVector**.

The application enables employees to upload internal onboarding documents and ask questions in natural language. It uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from the uploaded knowledge base and generate context-aware responses.

The current implementation runs the LLM and embedding models locally through Ollama, eliminating the need for a paid external LLM API during development.

## Application Preview

![Onboardly Dashboard](screenshots/dashboard.png)

## Key Features

- AI-powered employee onboarding chatbot
- Google OAuth2 authentication
- Retrieval-Augmented Generation (RAG)
- PDF document ingestion
- Automatic document chunking
- Semantic similarity search
- Vector storage using PostgreSQL and PGVector
- Local LLM inference using Ollama
- Local embedding generation using `nomic-embed-text`
- React-based responsive dashboard
- Authenticated document upload and chat APIs
- Grounded prompting to reduce hallucinated company-policy responses

## Architecture

```text
                         ┌─────────────────────┐
                         │    React + Vite     │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                              REST APIs
                                    │
                         ┌──────────▼──────────┐
                         │    Spring Boot      │
                         │      Backend        │
                         │                    │
                         │  Spring Security    │
                         │   Google OAuth2     │
                         └──────────┬──────────┘
                                    │
                                Spring AI
                       ┌────────────┴────────────┐
                       │                         │
                ┌──────▼───────┐         ┌──────▼───────┐
                │   PGVector   │         │    Ollama    │
                │  Similarity  │         │   Llama 3.2  │
                │    Search    │         │  Chat Model  │
                └──────▲───────┘         └──────────────┘
                       │
                ┌──────┴────────────┐
                │ nomic-embed-text  │
                │ Embedding Model   │
                └───────────────────┘
```

## RAG Workflow

### Document ingestion

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
Text Extraction
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

### Question answering

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
Retrieved Context + Question
       │
       ▼
Llama 3.2
       │
       ▼
Grounded Response
```

Instead of sending the complete knowledge base to the LLM, the application retrieves only the document chunks that are semantically relevant to the user's question.

## Technology Stack

| Area | Technologies |
|---|---|
| Backend | Java 17, Spring Boot |
| AI Framework | Spring AI |
| Security | Spring Security, Google OAuth2 / OpenID Connect |
| Frontend | React, Vite |
| LLM | Llama 3.2 |
| Model Runtime | Ollama |
| Embeddings | nomic-embed-text |
| Vector Store | PostgreSQL, PGVector |
| Infrastructure | Docker, Docker Compose |
| Build | Maven, npm |

## Project Structure

```text
onboarding-assistant/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/kajal/onboarding_assistant/
│       │       ├── config/
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
│   └── package.json
│
├── screenshots/
│   └── dashboard.png
│
├── docker-compose.yml
├── pom.xml
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Java 17+
- Maven
- Node.js and npm
- Docker Desktop
- Ollama
- Google Cloud OAuth credentials

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd onboarding-assistant
```

### 2. Download the AI models

The application uses separate models for response generation and vector embeddings.

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

Verify:

```bash
ollama list
```

### 3. Start PostgreSQL and PGVector

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

The current Docker configuration maps:

```text
localhost:5433 -> PostgreSQL container:5432
```

### 4. Enable the PGVector extension

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

### 5. Configure Google OAuth

Create an OAuth 2.0 Client ID in Google Cloud using the **Web application** client type.

Configure the following redirect URI:

```text
http://localhost:8080/login/oauth2/code/google
```

Set the credentials as environment variables:

```text
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

Do not commit OAuth client secrets to the repository.

### 6. Start the backend

From the project root:

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 7. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend and authenticate using Google.

## Usage

### Upload company knowledge

From the Knowledge Base section, upload a PDF containing onboarding or internal company information.

During ingestion, the application:

1. Extracts text from the PDF.
2. Splits the content into smaller chunks.
3. Generates embeddings for each chunk.
4. Stores the embeddings and associated metadata in PGVector.

### Ask questions

After uploading a document, employees can ask questions such as:

```text
How do I request VPN access?
```

The application performs semantic retrieval against PGVector and passes the most relevant document context to the LLM before generating the response.

If relevant company information cannot be retrieved, the assistant is instructed not to invent internal policies.

## API Overview

### Current user

```http
GET /api/auth/me
```

Returns information about the authenticated Google user.

### Chat

```http
GET /api/chat?message=<question>
```

Performs semantic retrieval and generates a RAG-based response.

### Upload document

```http
POST /api/documents/upload
Content-Type: multipart/form-data
```

Form field:

```text
file=<PDF>
```

### Semantic search

```http
GET /api/knowledge/search?question=<question>
```

Returns semantically relevant documents from the vector store.

## Security

Authentication is implemented using **Spring Security and Google OAuth2/OpenID Connect**.

The React frontend communicates with the Spring Boot backend using an authenticated server-side session.

OAuth credentials and other secrets should be supplied through environment variables and must not be committed to source control.

> The current security configuration is intended for local development. Production deployment will require additional hardening, including appropriate CSRF, cookie, CORS, HTTPS, and secret-management configuration.

## Current Limitations

The project is under active development. Currently:

- Uploaded vector chunks persist in PGVector.
- The document list displayed in the frontend is not yet persisted across page refreshes.
- Existing vector data is currently shared rather than isolated by authenticated user.
- Document deletion and re-indexing are not yet implemented.
- Source citations are not yet returned with generated answers.

These areas are planned as part of the next iterations.

## Roadmap

- [x] React dashboard
- [x] Spring Boot REST backend
- [x] Local LLM integration with Ollama
- [x] Local embedding model
- [x] PostgreSQL + PGVector
- [x] Semantic similarity search
- [x] RAG question-answering pipeline
- [x] PDF document ingestion
- [x] Document upload from React
- [x] Google OAuth2 authentication
- [x] Authenticated frontend/backend communication
- [ ] Persistent document metadata
- [ ] User-scoped knowledge bases
- [ ] Document deletion and re-indexing
- [ ] Source citations
- [ ] Conversation history
- [ ] Role-based access control
- [ ] Improved document management
- [ ] Backend and frontend containerization
- [ ] Production deployment

## Author

**Kajal**

Built as a hands-on implementation of full-stack Generative AI concepts including **Spring AI, Retrieval-Augmented Generation, vector databases, local LLM inference, semantic search, and OAuth2 authentication**.