import { Sparkles } from "lucide-react";

function WelcomeCard({ user }) {
    return (
        <section className="welcome-card">

            <div className="welcome-content">
        <span className="welcome-label">
          <Sparkles size={14} />
          YOUR ONBOARDING SPACE
        </span>

                <h1>
                    Good morning, {user.name} 👋
                </h1>

                <p>
                    Everything you need to get started.
                    Ask questions and explore company knowledge
                    with your AI onboarding assistant.
                </p>
            </div>

            <div className="assistant-art">
                <div className="glow-circle">

                    <div className="bot">
                        <div className="bot-antenna">
                            <span />
                        </div>

                        <div className="bot-face">
                            <span className="eye" />
                            <span className="eye" />
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}

export default WelcomeCard;