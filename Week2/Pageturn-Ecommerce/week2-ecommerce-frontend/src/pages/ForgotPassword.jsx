import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../features/authSlice';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('❌ Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('❌ Password must be at least 6 characters!');
      return;
    }

    try {
      const result = await dispatch(updatePassword({ email, newPassword })).unwrap();
      if (result.success) {
        setDone(true);
        toast.success('✅ Password updated successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      toast.error(err.message || '❌ Failed to update password');
    }
  };

  return (
    <div className="book-page">
      <div className="book-card">
        <h2 className="book-title">🔑 Change Password</h2>
        <p className="book-subtitle">
          Update your account password
        </p>

        {done ? (
          <div className="book-success">
            ✅ Password updated successfully!
            <br />
            <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.5rem' }}>
              Redirecting to login...
            </span>
          </div>
        ) : (
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
                  placeholder="🔒 New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="🔒 Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="form-input password-input"
                />
              </div>
            </div>

            <button type="submit" className="book-btn" disabled={status === 'loading'}>
              {status === 'loading' ? '⏳ Updating...' : '🔄 Update Password'}
            </button>

            {error && (
              <div className="book-error">
                ❌ {error === 'User not found' ? 'User not found. Please check your email.' : error}
              </div>
            )}
          </form>
        )}

        <p className="book-link" style={{ marginTop: '1.5rem' }}>
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;