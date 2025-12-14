import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check if the user has a token saved
    const token = localStorage.getItem('token');

    // If no token, force navigation to Login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If token exists, render the protected page (Dashboard)
    return children;
};

export default PrivateRoute;