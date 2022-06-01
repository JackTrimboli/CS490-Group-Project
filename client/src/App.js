import './App.css';
import LoginPage from './components/login/LoginPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Landing from './components/landing/Landing';
import { useState } from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
    setIsLoggedIn(true);
  }

  return (
    <HashRouter>
      <Routes className="App">
        <Route
          index
          element={isLoggedIn ? <Navigate to="/landing" replace /> : <LoginPage login={handleLogin} />}
        />
        <Route
          path="/landing"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Landing userObj={user} />
            </ProtectedRoute>
          } />
      </Routes>
    </HashRouter>
  );
}

export default App;