import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import WelcomeCard from "./components/WelcomeCard";
import ChatWindow from "./components/ChatWindow";
import DocumentPanel from "./components/DocumentPanel";
import "./App.css";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/auth/me", {
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Not authenticated");
                }

                return response.json();
            })
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    if (!user) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <h1>Onboardly</h1>

                    <p>
                        Your AI-powered onboarding assistant.
                    </p>

                    <a
                        className="google-login-button"
                        href="http://localhost:8080/oauth2/authorization/google"
                    >
                        Continue with Google
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar user={user} />

            <main className="main-content">
                <WelcomeCard user={user} />

                <div className="dashboard-content">
                    <ChatWindow />
                    <DocumentPanel />
                </div>
            </main>
        </div>
    );
}

export default App;