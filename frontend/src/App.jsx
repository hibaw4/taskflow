import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import PrivateRoute from './components/PrivateRoute'; // <--- Import the Guard

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Start at Login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Protect the dashboard, only access it after logging in */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/project/:id" 
          element={
            <PrivateRoute>
              <ProjectDetails />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;