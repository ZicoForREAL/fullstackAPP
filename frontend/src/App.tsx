import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import ClientDashboard from './components/ClientDashboard';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/coach" element={<CoachDashboard />} />
            <Route path="/client" element={<ClientDashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
