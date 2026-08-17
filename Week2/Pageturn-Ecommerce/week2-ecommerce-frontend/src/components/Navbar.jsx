import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';

function Navbar() {
  const { token, role, username } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="book-navbar">
      <Link to="/" className="brand">
        <svg className="brand-icon" width="45" height="45" viewBox="0 0 45 45" fill="none">
          <rect x="4" y="4" width="37" height="37" rx="3" fill="#5C3A1E" stroke="#3D2612" strokeWidth="2"/>
          <rect x="8" y="7" width="29" height="31" rx="2" fill="#FDF6E9" stroke="#D8C4A0" strokeWidth="1.5"/>
          <line x1="13" y1="14" x2="32" y2="14" stroke="#D8C4A0" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="13" y1="19" x2="32" y2="19" stroke="#D8C4A0" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="13" y1="24" x2="32" y2="24" stroke="#D8C4A0" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="13" y1="29" x2="27" y2="29" stroke="#D8C4A0" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M22 7L24.5 14L22 19L19.5 14L22 7Z" fill="#C0392B" stroke="#922B21" strokeWidth="1"/>
          <rect x="4" y="4" width="6" height="37" rx="1" fill="#B8860B" opacity="0.4"/>
          <line x1="5" y1="12" x2="8" y2="12" stroke="#D4AF37" strokeWidth="1"/>
          <line x1="5" y1="22" x2="8" y2="22" stroke="#D4AF37" strokeWidth="1"/>
          <line x1="5" y1="32" x2="8" y2="32" stroke="#D4AF37" strokeWidth="1"/>
          <path d="M35 7L38 10L35 13V7Z" fill="#E8DCC8" stroke="#D8C4A0" strokeWidth="0.8"/>
        </svg>
        <div>
          <h2>Pageturn</h2>
          <span className="tagline">Every genre, one shelf away.</span>
        </div>
      </Link>
      
      <div className="links">
        {token ? (
          <>
            <Link to="/">📚 Books</Link>
            <Link to="/favorites">❤️ Favorites</Link>
            <Link to="/cart">
              🛒 Cart
              {items.length > 0 && (
                <span className="nav-cart-badge">{items.length}</span>
              )}
            </Link>
            {/*  Admin Link - Only for admin */}
            {role === 'admin' && (
              <Link to="/admin">⚙️ Admin</Link>
            )}
            <span className="user-name">👤 {username}</span>
            <button onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;