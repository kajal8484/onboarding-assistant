import {
    Home,
    MessageCircle,
    FileText,
    Settings
} from "lucide-react";

function Sidebar({ user }) {
    return (
        <aside className="sidebar">

            {/* Logo */}
            <div className="brand">
                <div className="brand-icon">✣</div>

                <div>
                    <h2>Onboardly</h2>
                    <span>AI Assistant</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="nav">

                <button className="nav-item active">
                    <Home size={17} />
                    <span>Home</span>
                </button>

                <button className="nav-item">
                    <MessageCircle size={17} />
                    <span>Chat</span>
                </button>

                <button className="nav-item">
                    <FileText size={17} />
                    <span>Documents</span>
                </button>

                <button className="nav-item">
                    <Settings size={17} />
                    <span>Settings</span>
                </button>

            </nav>

            {/* Logged-in Google User */}
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
                    <strong>
                        {user?.name || "User"}
                    </strong>

                    <span>
            {user?.email || "Employee"}
          </span>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;