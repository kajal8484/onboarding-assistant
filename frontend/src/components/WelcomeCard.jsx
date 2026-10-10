import { ArrowDownRight, Sparkles } from "lucide-react";

function WelcomeCard({ user }) {

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good morning";
        }

        if (hour < 17) {
            return "Good afternoon";
        }

        return "Good evening";
    };

    const firstName =
        user?.name?.split(" ")[0] || "there";

    return (
        <section className="welcome-card">
            <div className="welcome-content">
                <span className="welcome-label">
                    <Sparkles size={14} />
                    YOUR ONBOARDING NOTEBOOK
                </span>

                <h1>
                    {getGreeting()}, {firstName}!
                </h1>

                <p>
                    Ask questions, explore company knowledge and keep your
                    first days on track—all in one friendly space.
                </p>

                <span className="welcome-nudge">
                    Start with a question
                    <ArrowDownRight size={17} aria-hidden="true" />
                </span>
            </div>

            <div className="assistant-art" aria-hidden="true">
                <span className="doodle-star star-one">✦</span>
                <span className="doodle-star star-two">✧</span>
                <div className="bot-shadow" />
                <div className="bot">
                    <div className="bot-antenna"><span /></div>
                    <div className="bot-face">
                        <span className="eye" />
                        <span className="eye" />
                        <span className="bot-smile" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WelcomeCard;
