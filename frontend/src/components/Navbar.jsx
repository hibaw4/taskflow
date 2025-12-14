import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const username = localStorage.getItem('username') || 'User';
    const navigate = useNavigate();

    const handleLogout = () => {
        if(confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            {/* Left: Brand Logo */}
            <Link to="/dashboard" className="navbar-brand">
                TaskFlow
            </Link>

            {/* Right: User Section (Name + Logout) */}
            <div className="navbar-user-section">
                <span className="navbar-username">
                    <strong>{username}</strong>
                </span>
                
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;