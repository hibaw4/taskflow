import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', formData.username);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid Username or Password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    
                    <div className="password-wrapper">
                        <input
                            className="auth-input"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="eye-button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={showPassword ? "#3498db" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                                {!showPassword && <line x1="1" y1="1" x2="23" y2="23"></line>}
                            </svg>
                        </button>
                    </div>

                    <button type="submit" style={{ fontSize: '1.2rem', padding: '16px' }}>
                        Login
                    </button>
                </form>
                
                <p className="auth-footer">
                    New to TaskFlow? 
                    <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;