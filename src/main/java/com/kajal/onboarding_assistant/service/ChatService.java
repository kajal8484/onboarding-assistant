package com.kajal.onboarding_assistant.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ChatService {

    private static final Logger log =
            LoggerFactory.getLogger(ChatService.class);

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

        if (question == null || question.isBlank()) {
            return "Please enter a question.";
        }

        // Retrieve relevant chunks from PGVector.
        List<Document> documents =
                vectorStore.similaritySearch(
                        SearchRequest.builder()
                                .query(question.trim())
                                .topK(8)
                                // Accept everything temporarily while debugging.
                                .similarityThreshold(0.0)
                                .build()
                );

        log.info(
                "Retrieved {} chunks for question: {}",
                documents.size(),
                question
        );

        for (int i = 0; i < documents.size(); i++) {
            Document document = documents.get(i);

            log.info(
                    "Chunk={}, score={}, metadata={}, text={}",
                    i + 1,
                    document.getScore(),
                    document.getMetadata(),
                    preview(document.getText())
            );
        }

        if (documents.isEmpty()) {
            return "I couldn't find this information in the company knowledge base.";
        }

        String context = IntStream
                .range(0, documents.size())
                .mapToObj(index -> {
                    String text = documents.get(index).getText();

                    return """
                            --- KNOWLEDGE CHUNK %d ---
                            %s
                            """.formatted(
                            index + 1,
                            text == null ? "" : text
                    );
                })
                .collect(Collectors.joining("\n"));

        String userPrompt = """
                Use the company knowledge below to answer the question.

                Understand grammatical mistakes and different wording in the
                employee's question. If relevant information exists across
                multiple chunks, combine it into one clear answer.

                Do not add facts that are absent from the company knowledge.

                If the knowledge genuinely does not contain relevant
                information, respond exactly:
                "I couldn't find this information in the company knowledge base."

                COMPANY KNOWLEDGE:
                %s

                EMPLOYEE QUESTION:
                %s
                """.formatted(context, question.trim());

        String response = chatClient
                .prompt()
                .system("""
                        You are an enterprise onboarding assistant.

                        Answer questions using only the supplied company
                        knowledge. Give a clear and well-structured answer.
                        Never invent company information.
                        """)
                .user(userPrompt)
                .call()
                .content();

        if (response == null || response.isBlank()) {
            return "I couldn't generate an answer from the company knowledge base.";
        }

        return response;
    }

    private String preview(String text) {

        if (text == null || text.isBlank()) {
            return "[EMPTY TEXT]";
        }

        String cleaned = text.replaceAll("\\s+", " ").trim();

        return cleaned.length() <= 300
                ? cleaned
                : cleaned.substring(0, 300) + "...";
    }
}