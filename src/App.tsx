import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./config/parse";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Dashboard from "./components/Dashboard";
import { AuthService } from "./services/auth.service";
import LoadingSpinner from "./components/common/LoadingSpinner"; // Componente de carga (crearlo)

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar la sesión al cargar la aplicación
    const checkAuth = async () => {
      try {
        // Esto recupera la sesión si existe un token válido
        const currentUser = await Parse.User.currentAsync();
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  console.log(
    "App renderizado - auth:",
    isAuthenticated,
    "loading:",
    isLoading
  );

  if (isLoading) {
    return <LoadingSpinner />; // Muestra un spinner mientras verifica
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <LoginForm onLogin={() => setIsAuthenticated(true)} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <RegisterForm onRegister={() => setIsAuthenticated(true)} />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  isAuthenticated: boolean;
}> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute: React.FC<{
  children: React.ReactNode;
  isAuthenticated: boolean;
}> = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default App;
