import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../features/authSlice';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser({ username, password }));
    if (signupUser.fulfilled.match(result)) {
      setDone(true);
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  return (
    <div className="book-page">
      <div className="book-card">
        <h1 className="book-title">New Chapter</h1>
        <p className="book-subtitle">Create your account to begin</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating...' : 'Sign Up'}
          </button>
          {error && <p className="book-error">{error}</p>}
          {done && <p className="book-success">Account created! Redirecting...</p>}
        </form>
        <p className="book-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;