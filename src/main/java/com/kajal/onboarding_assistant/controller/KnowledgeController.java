package com.kajal.onboarding_assistant.controller;

import com.kajal.onboarding_assistant.service.KnowledgeService;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@CrossOrigin(origins = "http://localhost:5173")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    public KnowledgeController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @PostMapping("/sample")
    public String addSampleKnowledge() {
        knowledgeService.addSampleKnowledge();
        return "Sample onboarding knowledge added.";
    }

    @GetMapping("/search")
    public List<Document> search(@RequestParam String question) {
        return knowledgeService.search(question);
    }
}