import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <h2>TaskFlow</h2>
            <div className="links">
                <Link to="/">Dashboard</Link>
                <Link to="/login" className="btn-logout">Logout</Link>
            </div>
        </nav>
    );
}

export default Navbar;