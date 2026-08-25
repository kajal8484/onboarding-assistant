import {
    Home,
    MessageCircle,
    FileText,
    Settings
} from "lucide-react";

function Sidebar({ user }) {

    const scrollTo = (id) => {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
    };

    return (
        <aside className="sidebar">

            <div className="brand">
                <div className="brand-icon">✣</div>

                <div>
                    <h2>Onboardly</h2>
                    <span>AI Assistant</span>
                </div>
            </div>

            <nav className="nav">

                <button
                    className="nav-item active"
                    onClick={() => window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })}
                >
                    <Home size={17} />
                    <span>Home</span>
                </button>

                <button
                    className="nav-item"
                    onClick={() => scrollTo("chat-section")}
                >
                    <MessageCircle size={17} />
                    <span>Chat</span>
                </button>

                <button
                    className="nav-item"
                    onClick={() => scrollTo("documents-section")}
                >
                    <FileText size={17} />
                    <span>Documents</span>
                </button>

                <button className="nav-item">
                    <Settings size={17} />
                    <span>Settings</span>
                </button>

            </nav>

            <div className="sidebar-profile">

                {user?.picture ? (
                    <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="profile-image"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="profile-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                )}

                <div className="profile-details">
                    <strong>{user?.name || "User"}</strong>
                    <span>{user?.email || "Employee"}</span>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;