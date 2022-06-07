import './App.css';
import LoginPage from './components/login/LoginPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navigation from './components/navigation/Navigation';
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
    <div className='App'>
      <HashRouter>
        <Routes>
          <Route
            index
            element={isLoggedIn ? <Navigate to="/landing" replace /> : <LoginPage login={handleLogin} />}
          />
          <Route
            path="/landing"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigation />
                <Landing userObj={user} />
              </ProtectedRoute>
            } />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;