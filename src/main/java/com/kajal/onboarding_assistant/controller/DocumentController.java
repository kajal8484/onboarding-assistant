package com.kajal.onboarding_assistant.controller;

import com.kajal.onboarding_assistant.service.DocumentIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")

public class DocumentController {

    private final DocumentIngestionService ingestionService;

    public DocumentController(
            DocumentIngestionService ingestionService
    ) {
        this.ingestionService = ingestionService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Please select a file."
                    ));
        }

        if (!file.getOriginalFilename()
                .toLowerCase()
                .endsWith(".pdf")) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Only PDF files are supported currently."
                    ));
        }

        int chunks = ingestionService.ingest(file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Document processed successfully.",
                        "filename", file.getOriginalFilename(),
                        "chunks", chunks
                )
        );
    }
}