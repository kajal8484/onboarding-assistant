import Sidebar from "./components/Sidebar";
import WelcomeCard from "./components/WelcomeCard";
import ChatWindow from "./components/ChatWindow";
import DocumentPanel from "./components/DocumentPanel";

import "./App.css";

function App() {

    // Temporary.
    // Later this will come from authenticated user information.
    const user = {
        name: "Kajal"
    };

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