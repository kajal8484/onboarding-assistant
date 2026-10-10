
import {
    Home,
    MessageCircle,
    FileText,
    Settings,
    Sparkles,
    LogOut
} from "lucide-react";

function Sidebar({ user }) {

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            window.location.replace("/");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to log out. Please try again.");
        }
    };

    return (
        <aside className="sidebar">

            <div className="brand">
                <div className="brand-icon">
                    <Sparkles size={20} />
                </div>

                <div>
                    <h2>Onboardly</h2>
                    <span>AI Assistant</span>
                </div>
            </div>

            <nav className="nav" aria-label="Primary navigation">

                <button
                    className="nav-item active"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        })
                    }
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

            <div className="sidebar-footer">

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

                <button
                    type="button"
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={17} />
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
