import { useRef, useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";

function DocumentPanel() {
    const fileInputRef = useRef(null);

    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setMessage("");
        setError("");

        if (!file.name.toLowerCase().endsWith(".pdf")) {
            setError("Only PDF files are supported right now.");
            event.target.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/documents/upload",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Document upload failed.");
            }

            setDocuments((previousDocuments) => [
                {
                    name: data.filename,
                    chunks: data.chunks,
                    status: "Ready for AI"
                },
                ...previousDocuments
            ]);

            setMessage("Document added to the knowledge base.");
        } catch (uploadError) {
            console.error(uploadError);

            setError(
                uploadError.message ||
                "Something went wrong while uploading the document."
            );
        } finally {
            setUploading(false);

            // Allows selecting the same file again later.
            event.target.value = "";
        }
    };

    return (
        <section
            id="documents-section"
            className="document-panel"
        >
            <div className="panel-heading">
                <div>
                    <h3>Knowledge Base</h3>
                    <p>Documents available to your assistant</p>
                </div>

                <span className="document-count">
          {documents.length}
        </span>
            </div>

            <div className={`upload-area ${uploading ? "uploading" : ""}`}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    hidden
                />

                <div className="upload-icon">
                    {uploading ? (
                        <div className="upload-spinner" />
                    ) : (
                        <Upload size={21} />
                    )}
                </div>

                <strong>
                    {uploading
                        ? "Teaching your assistant..."
                        : "Upload document"}
                </strong>

                <span>
          {uploading
              ? "Creating embeddings and storing knowledge"
              : "PDF files supported"}
        </span>

                <button
                    onClick={openFilePicker}
                    disabled={uploading}
                >
                    {uploading ? "Processing..." : "Choose file"}
                </button>
            </div>

            {message && (
                <div className="upload-success">
                    <CheckCircle size={15} />
                    {message}
                </div>
            )}

            {error && (
                <div className="upload-error">
                    <AlertCircle size={15} />
                    {error}
                </div>
            )}

            <div className="document-list">
                {documents.length === 0 ? (
                    <div className="empty-documents">
                        <FileText size={22} />

                        <span>
              Your knowledge base is empty.
            </span>
                    </div>
                ) : (
                    documents.map((document, index) => (
                        <div
                            className="document"
                            key={`${document.name}-${index}`}
                        >
                            <div className="document-icon">
                                <FileText size={17} />
                            </div>

                            <div className="document-info">
                                <strong>{document.name}</strong>

                                <span>
                  {document.status} · {document.chunks} chunks
                </span>
                            </div>

                            <CheckCircle
                                className="document-ready"
                                size={15}
                            />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default DocumentPanel;