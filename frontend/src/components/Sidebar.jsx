import {
    House,
    MessageCircle,
    FileText,
    Settings,
    Sparkles
} from "lucide-react";

function Sidebar({ user }) {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-logo">
                    <Sparkles size={19} />
                </div>

                <div>
                    <h2>Onboardly</h2>
                    <span>AI Assistant</span>
                </div>
            </div>

            <nav className="nav">
                <button className="nav-item active">
                    <House size={18} />
                    Home
                </button>

                <button className="nav-item">
                    <MessageCircle size={18} />
                    Chat
                </button>

                <button className="nav-item">
                    <FileText size={18} />
                    Documents
                </button>

                <button className="nav-item">
                    <Settings size={18} />
                    Settings
                </button>
            </nav>

            <div className="sidebar-profile">
                <div className="profile-avatar">
                    {user.name.charAt(0)}
                </div>

                <div>
                    <strong>{user.name}</strong>
                    <span>Employee</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;