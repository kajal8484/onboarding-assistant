import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

const suggestions = [
    "What should I do on my first day?",
    "How do I request IT access?",
    "Explain the leave policy"
];

function ChatWindow() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hi! 👋 I'm your onboarding assistant. How can I help you?"
        }
    ]);

    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

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
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div
            id="chat-section"
            className="chat-window"
        >
            <div className="chat-header">
                <div className="ai-avatar"><Bot size={21} /></div>

                <div>
                    <h3>Onboarding Assistant</h3>
                    <span><i /> Ready to help</span>
                </div>

                <div className="chat-sticker">
                    <Sparkles size={13} /> AI powered
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

                {messages.length === 1 && !loading && (
                    <div className="suggestion-list" aria-label="Suggested questions">
                        <span>Try asking</span>
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => setMessage(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about onboarding..."
                    rows={1}
                    aria-label="Message"
                />

                <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    aria-label="Send message"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;
