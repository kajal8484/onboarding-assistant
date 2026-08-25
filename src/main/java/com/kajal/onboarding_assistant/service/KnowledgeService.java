package com.kajal.onboarding_assistant.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class KnowledgeService {

    private final VectorStore vectorStore;

    public KnowledgeService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void addSampleKnowledge() {

        Document vpnDocument = new Document(
                "Employees who require VPN access must raise a ServiceNow " +
                        "request under Network > VPN Access. Manager approval is " +
                        "required before VPN access can be granted.",
                Map.of(
                        "source", "IT Access Guide",
                        "category", "IT"
                )
        );

        vectorStore.add(List.of(vpnDocument));
    }

    public List<Document> search(String question) {
        return vectorStore.similaritySearch(question);
    }
}