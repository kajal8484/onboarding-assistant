package com.kajal.onboarding_assistant.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
public class DocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String uploadedBy;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column(nullable = false)
    private Integer chunkCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;

    public DocumentEntity() {
    }

    public DocumentEntity(
            String filename,
            String uploadedBy,
            LocalDateTime uploadedAt,
            Integer chunkCount,
            DocumentStatus status
    ) {
        this.filename = filename;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;
        this.chunkCount = chunkCount;
        this.status = status;
    }

    public UUID getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public Integer getChunkCount() {
        return chunkCount;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public void setChunkCount(Integer chunkCount) {
        this.chunkCount = chunkCount;
    }
}