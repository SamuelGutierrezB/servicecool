import React from "react";
import { AuthService } from "../services/auth.service";

const Dashboard: React.FC = () => {
  const user = AuthService.getCurrentUser();

  const handleLogout = async () => {
    await AuthService.logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            ServiceCool Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Bienvenido, {user?.get("username")}
            </h2>
            <p className="text-gray-600">
              Aquí podrás gestionar tus tickets de mantenimiento para tus
              unidades de refrigeración.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
