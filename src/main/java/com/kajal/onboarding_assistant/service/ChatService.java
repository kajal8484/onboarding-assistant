package com.kajal.onboarding_assistant.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public ChatService(
            ChatClient.Builder builder,
            VectorStore vectorStore
    ) {
        this.chatClient = builder.build();
        this.vectorStore = vectorStore;
    }

    public String ask(String question) {

        // 1. Search company knowledge
        List<Document> documents =
                vectorStore.similaritySearch(
                        SearchRequest.builder()
                                .query(question)
                                .topK(3)
                                .build()
                );

        // 2. Convert retrieved documents into context
        String context = documents.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        // 3. Give question + retrieved context to LLM
        return chatClient
                .prompt()
                .system("""
                        You are an enterprise onboarding assistant.

                        Answer the employee's question using ONLY the
                        provided company knowledge.

                        If the answer cannot be found in the provided
                        knowledge, say:
                        "I couldn't find this information in the company knowledge base."

                        Do not invent company policies.

                        COMPANY KNOWLEDGE:
                        %s
                        """.formatted(context))
                .user(question)
                .call()
                .content();
    }
}