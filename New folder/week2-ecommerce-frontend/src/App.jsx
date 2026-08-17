import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { token, role } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<signup />} />
      <Route path="/" element={token ? <Products /> : <Navigate to="/login" />} />
      <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" />} />
      <Route path="/favorites" element={token ? <Favorites /> : <Navigate to="/login" />} />
      <Route
          path="/admin"
          element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;