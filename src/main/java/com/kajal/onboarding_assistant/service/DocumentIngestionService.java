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

@Service
public class DocumentIngestionService {

    private final VectorStore vectorStore;

    public DocumentIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public int ingest(MultipartFile file) throws IOException {

        // Temporary local copy because the PDF reader needs a Resource.
        File tempFile = File.createTempFile("onboarding-", ".pdf");

        try {
            file.transferTo(tempFile);

            // 1. Read PDF
            PagePdfDocumentReader reader =
                    new PagePdfDocumentReader(
                            new FileSystemResource(tempFile)
                    );

            List<Document> documents = reader.get();

            // 2. Add our own metadata
            documents.forEach(document -> {
                document.getMetadata().put(
                        "source",
                        file.getOriginalFilename()
                );

                document.getMetadata().put(
                        "type",
                        "pdf"
                );
            });

            // 3. Break large text into smaller chunks
            TokenTextSplitter splitter =
                    new TokenTextSplitter();

            List<Document> chunks =
                    splitter.apply(documents);

            // 4. Embeddings are generated and stored in PGVector
            vectorStore.add(chunks);

            return chunks.size();

        } finally {
            tempFile.delete();
        }
    }
}