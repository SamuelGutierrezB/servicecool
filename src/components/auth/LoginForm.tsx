import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, UserCredentials } from "../../services/auth.service";

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Iniciar Sesión en ServiceCool
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
