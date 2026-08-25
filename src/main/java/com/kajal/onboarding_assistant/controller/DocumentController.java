package com.kajal.onboarding_assistant.controller;

import com.kajal.onboarding_assistant.entity.DocumentEntity;
import com.kajal.onboarding_assistant.entity.DocumentStatus;
import com.kajal.onboarding_assistant.repository.DocumentRepository;
import com.kajal.onboarding_assistant.service.DocumentIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentIngestionService ingestionService;
    private final DocumentRepository documentRepository;

    public DocumentController(
            DocumentIngestionService ingestionService,
            DocumentRepository documentRepository
    ) {
        this.ingestionService = ingestionService;
        this.documentRepository = documentRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal OidcUser user
    ) {

        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Please select a file."
                    ));
        }

        String filename = file.getOriginalFilename();

        if (filename == null ||
                !filename.toLowerCase().endsWith(".pdf")) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Only PDF files are supported currently."
                    ));
        }

        String uploadedBy = user.getEmail();

        DocumentEntity document = new DocumentEntity(
                filename,
                uploadedBy,
                LocalDateTime.now(),
                0,
                DocumentStatus.PROCESSING
        );

        document = documentRepository.save(document);

        try {

            int chunks = ingestionService.ingest(
                    file,
                    document.getId(),
                    uploadedBy
            );

            document.setChunkCount(chunks);
            document.setStatus(DocumentStatus.READY);

            documentRepository.save(document);

            return ResponseEntity.ok(
                    Map.of(
                            "id", document.getId(),
                            "message", "Document processed successfully.",
                            "filename", document.getFilename(),
                            "chunks", document.getChunkCount(),
                            "status", document.getStatus()
                    )
            );

        } catch (Exception exception) {

            document.setStatus(DocumentStatus.FAILED);
            documentRepository.save(document);

            return ResponseEntity
                    .internalServerError()
                    .body(Map.of(
                            "message",
                            "Failed to process document.",
                            "filename",
                            filename
                    ));
        }
    }

    @GetMapping
    public List<DocumentEntity> getDocuments(
            @AuthenticationPrincipal OidcUser user
    ) {

        return documentRepository
                .findByUploadedByOrderByUploadedAtDesc(
                        user.getEmail()
                );
    }
}