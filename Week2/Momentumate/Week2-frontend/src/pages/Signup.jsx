import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/signup', { username, password });
            navigate('/');   
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-page'>
            <div className='auth-card'>
                <h1>Join Momentummate.io</h1>
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
                            placeholder='Choose a password'
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

                    <button type='submit' disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <p className='switch-link'>
                    Already have an account? <Link to="/">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;