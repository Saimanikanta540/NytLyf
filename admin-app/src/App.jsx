import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const navigate = useNavigate();
  // Using an axios interceptor directly in the app root to catch 401s globally
  React.useEffect(() => {
    import('./api/client').then(({ default: client }) => {
      const interceptor = client.interceptors.response.use(
        (res) => res,
        (err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem('admin_token');
            navigate('/login');
          }
          return Promise.reject(err);
        }
      );
      return () => client.interceptors.response.eject(interceptor);
    });
  }, [navigate]);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Layout><Users /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <Layout><Events /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/events/new" 
          element={
            <ProtectedRoute>
              <Layout><AddEvent /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/events/edit/:id" 
          element={
            <ProtectedRoute>
              <Layout><AddEvent /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
