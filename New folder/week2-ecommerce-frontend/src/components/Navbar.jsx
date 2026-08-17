import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';

function Navbar() {
  const { token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="book-navbar">
      <h2>📖 The Marketplace</h2>
      <div className="links">
        {token ? (
          <>
            <Link to="/">Products</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/cart">Cart</Link>
            {role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout}>Logout</button>
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