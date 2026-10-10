import { useState } from "react";

function ChatWindow() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hi! 👋 I'm your onboarding assistant. How can I help you?"
        }
    ]);

    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        const currentMessage = message;

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: currentMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/chat?message=${encodeURIComponent(
                    currentMessage
                )}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    "Chat request failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `Chat request failed: ${response.status}`
                );
            }

            const answer = await response.text();

            setMessages((previous) => [
                ...previous,
                {
                    sender: "ai",
                    text: answer
                }
            ]);

        } catch (error) {

            console.error("Chat error:", error);

            setMessages((previous) => [
                ...previous,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't process your request."
                }
            ]);

        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div
            id="chat-section"
            className="chat-window"
        >
            <div className="chat-header">
                <div className="ai-avatar">AI</div>

                <div>
                    <h3>Onboarding Assistant</h3>
                    <span>● Online</span>
                </div>
            </div>

            <div className="messages">
                {messages.map((item, index) => (
                    <div
                        key={index}
                        className={
                            item.sender === "user"
                                ? "message-row user-row"
                                : "message-row ai-row"
                        }
                    >
                        <div className={`message ${item.sender}`}>
                            {item.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-row ai-row">
                        <div className="message ai typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="chat-input">
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about onboarding..."
                />

                <button onClick={sendMessage} disabled={loading}>
                    ➜
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;