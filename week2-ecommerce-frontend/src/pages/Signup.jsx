import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser, clearError } from '../features/authSlice';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  // Clear error when user types
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser({ username: email, password }));
    if (signupUser.fulfilled.match(result)) {
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="book-page">
      <div className="book-card">
        <h2 className="book-title">✨ New Chapter</h2>
        <p className="book-subtitle">Create your account to begin</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="📧 Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="🔒 Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="form-input password-input"
              />
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="book-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '⏳ Creating...' : '📖 Sign Up'}
          </button>
          
          {/* ✅ Proper Error Display */}
          {error && (
            <div className="book-error">
              {error === 'This email is already registered. Please login instead.' && '❌ '}
              {error === 'Please enter a valid email address' && '⚠️ '}
              {error === 'Password must be at least 6 characters' && '⚠️ '}
              {error}
            </div>
          )}
          
          {done && (
            <div className="book-success">
              ✅ Account created successfully! Redirecting to login...
            </div>
          )}
        </form>
        
        <p className="book-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;