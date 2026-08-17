import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../features/authSlice';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    const result = await dispatch(loginUser({ username: email, password }));
    if (loginUser.fulfilled.match(result)) {      // matches result- authSlics redux- fulfilled
      navigate('/');
    }
  };

  return (
    <div className="book-page">
      <div className="book-card">
        <h2 className="book-title">📖 Welcome Back</h2>
        <p className="book-subtitle">Login to continue reading</p>
        
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
                placeholder="🔒 Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>

          <button type="submit" className="book-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '⏳ Logging in...' : '🚀 Login'}
          </button>
          
          {/* Proper Error Display */}
          {error && (
            <div className="book-error">
              {error === 'No account found with this email. Please sign up first.' && '❌ '}
              {error === 'Incorrect password. Please try again.' && '❌ '}
              {error === 'Please fill in all fields' && '⚠️ '}
              {error}
            </div>
          )}
        </form>
        
        <p className="book-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;