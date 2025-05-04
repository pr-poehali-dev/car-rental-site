
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Catalog from './pages/Catalog';
import CarDetail from './pages/CarDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import Unauthorized from './pages/admin/Unauthorized';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/unauthorized" element={<Unauthorized />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
