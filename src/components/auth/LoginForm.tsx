import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, UserCredentials } from "../../services/auth.service";
import "./LoginForm.css";
import logo from "../../assets/images/logo.jpg";

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.login(credentials);
      navigate("/dashboard"); // Redirige al dashboard después del login
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al iniciar sesión"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-icon">
        <img src={logo} alt="SrviceCool" />
      </div>
      <h2 className="login-title">Iniciar Sesión en ServiceCool</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`submit-btn ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      <div className="register-link">
        <p>
          ¿No tienes cuenta?{" "}
          <a href="/register" className="register-text">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
