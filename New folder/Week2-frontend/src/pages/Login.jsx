import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data.error || 'Login failed');
        }
    };

    return (
        <div className='auth-page'>
            <div className='auth-card'>
                <h1>Momentumate.io</h1>
                <p className='subtitle'>Your study mate.</p>

                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="you@example.com"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        title="Please enter a valid email address"
                        required
                    />

                    <label>Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-pass-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {error && <p className='error-text'>{error}</p>}

                    <button type="submit">Log In</button>
                </form>

                <p className='switch-link'>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
                <p className="switch-link">
                    <Link to="/forgot-password">Forgot password?</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;