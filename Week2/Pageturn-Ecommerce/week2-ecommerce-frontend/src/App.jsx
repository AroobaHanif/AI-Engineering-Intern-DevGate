import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const { token, role } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Navbar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fdf6e9',
            color: '#6b4226',
            border: '1px solid #d8c4a0',
          }
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/*  User Routes */}
        <Route path="/" element={token ? <Products /> : <Navigate to="/login" />} />
        <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={token ? <Favorites /> : <Navigate to="/login" />} />
        
        {/*  Admin Routes - Sirf Admin ko access */}
        <Route 
          path="/admin" 
          element={
            token && role === 'admin' ? 
              <AdminDashboard /> : 
              <Navigate to="/" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;