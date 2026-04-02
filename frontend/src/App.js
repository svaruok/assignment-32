import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const handleAuthSuccess = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Feed onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <Login onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <Signup onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
