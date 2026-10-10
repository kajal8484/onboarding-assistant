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
          AI ONBOARDING ASSISTANT
        </span>

                <h1>
                    {getGreeting()}, {firstName}
                </h1>

                <p>
                    What can I help you with today?
                </p>

            </div>

            {/* Keep your existing anime/bot illustration here */}

        </section>
    );
}

export default WelcomeCard;