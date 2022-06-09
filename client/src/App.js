import './App.css';
import LoginPage from './components/login/LoginPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navigation from './components/navigation/Navigation';
import Landing from './components/landing/Landing';
import { useState } from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import QuestionBank from './components/questions/QuestionBank';
import ExamEditor from './components/exams/ExamEditor';
import Exam from './components/exams/Exam';

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
            element={isLoggedIn ? <Navigate to="/Exams" replace /> : <LoginPage login={handleLogin} />}
          />
          <Route
            path="/Exams"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigation user={user} />
                <Landing userObj={user} />
              </ProtectedRoute>
            } />
          <Route
            path="/Questions"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigation user={user} />
                <QuestionBank user={user} />
              </ProtectedRoute>

            }
          />
          <Route
            path="/Grades"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigation user={user} />
              </ProtectedRoute>

            }
          />
          <Route
            path="/edit-exam"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigation user={user} />
                <ExamEditor user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/take-exam"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Navigation user={user} noTabs={true} />
                <Exam user={user} />
              </ProtectedRoute>
            } />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;