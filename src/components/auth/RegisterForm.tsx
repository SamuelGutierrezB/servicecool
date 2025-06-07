import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, UserCredentials } from "../../services/auth.service";
import "./RegisterForm.css";
import logo from "../../assets/images/logo.jpg";

const RegisterForm: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: "",
    password: "",
    email: "",
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
    console.log("Iniciando registro...", credentials); // Debug 1

    try {
      console.log("Llamando a AuthService.register..."); // Debug 2
      await AuthService.register(credentials);
      console.log("Registro exitoso, redirigiendo..."); // Debug 3
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en registro:", err); // Debug 4
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al registrar el usuario"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="logo-icon">
        <img src={logo} alt="SrviceCool" />
      </div>
      <h2 className="register-title">Registro en ServiceCool</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="register-form">
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
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
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
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <div className="login-link">
        <p>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="login-text">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
