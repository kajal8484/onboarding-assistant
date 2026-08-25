package com.kajal.onboarding_assistant.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentIngestionService {

    private final VectorStore vectorStore;

    public DocumentIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public int ingest(
            MultipartFile file,
            UUID documentId,
            String uploadedBy
    ) throws IOException {

        File tempFile = File.createTempFile(
                "onboarding-",
                ".pdf"
        );

        try {
            file.transferTo(tempFile);

            PagePdfDocumentReader reader =
                    new PagePdfDocumentReader(
                            new FileSystemResource(tempFile)
                    );

            List<Document> documents = reader.get();

            documents.forEach(document -> {
                document.getMetadata().put(
                        "source",
                        file.getOriginalFilename()
                );

                document.getMetadata().put(
                        "documentId",
                        documentId.toString()
                );

                document.getMetadata().put(
                        "uploadedBy",
                        uploadedBy
                );
            });

            TokenTextSplitter splitter =
                    new TokenTextSplitter();

            List<Document> chunks =
                    splitter.apply(documents);

            vectorStore.add(chunks);

            return chunks.size();

        } finally {
            tempFile.delete();
        }
    }
}