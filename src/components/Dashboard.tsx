import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";
import { AuthService } from "../services/auth.service";
import "./Dashboard.css"; // Archivo CSS que crearemos
import logo from "../assets/images/logo.jpg";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "pendiente" | "en progreso" | "resuelto";
  priority: "alta" | "media" | "baja";
  location: string;
  fridgeModel: string;
  type: "mantenimiento" | "revisión" | "falla";
  dueDate?: Date;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }

        const Ticket = Parse.Object.extend("Ticket");
        const query = new Parse.Query(Ticket);
        query.equalTo("client", currentUser);
        query.descending("createdAt");
        const results = await query.find();

        const formattedTickets = results.map((ticket) => ({
          id: ticket.id,
          title: ticket.get("title"),
          description: ticket.get("description"),
          status: ticket.get("status"),
          priority: ticket.get("priority"),
          location: ticket.get("location"),
          fridgeModel: ticket.get("fridgeModel"),
          type: ticket.get("type"),
          dueDate: ticket.get("dueDate"),
          createdAt: ticket.get("createdAt"),
        }));

        setTickets(formattedTickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar los tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [navigate]);

  const handleCreateTicket = () => {
    navigate("/tickets/new");
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}/edit`);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "alta":
        return "priority-high";
      case "media":
        return "priority-medium";
      case "baja":
        return "priority-low";
      default:
        return "priority-default";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pendiente":
        return "status-pending";
      case "en progreso":
        return "status-in-progress";
      case "resuelto":
        return "status-resolved";
      default:
        return "status-default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mantenimiento":
        return (
          <svg className="icon icon-maintenance" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case "revisión":
        return (
          <svg className="icon icon-review" viewBox="0 0 24 24">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case "falla":
        return (
          <svg className="icon icon-failure" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="icon icon-default" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (activeFilter !== "all" && ticket.status !== activeFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.fridgeModel.toLowerCase().includes(query) ||
        ticket.location.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const statusCounts = {
    all: tickets.length,
    pendiente: tickets.filter((t) => t.status === "pendiente").length,
    "en progreso": tickets.filter((t) => t.status === "en progreso").length,
    resuelto: tickets.filter((t) => t.status === "resuelto").length,
  };

  const handleLogout = async () => {
    await AuthService.logout();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">
              <img src={logo} alt="SrviceCool" />
            </div>
            <h1>
              ServiceCool <span>Dashboard</span>
            </h1>
          </div>
          <button onClick={handleCreateTicket} className="create-ticket-btn">
            <svg viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Nuevo Ticket
          </button>
          <button onClick={handleLogout} className="create-ticket-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stats-grid">
          {/* All Tickets */}
          <div
            onClick={() => setActiveFilter("all")}
            className={`stat-card ${activeFilter === "all" ? "active" : ""}`}
          >
            <div className="stat-content">
              <div className="stat-icon-container bg-blue">
                <svg viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-title">Total Tickets</div>
                <div className="stat-value">{statusCounts.all}</div>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div
            onClick={() => setActiveFilter("pendiente")}
            className={`stat-card ${
              activeFilter === "pendiente" ? "active" : ""
            }`}
          >
            <div className="stat-content">
              <div className="stat-icon-container bg-gray">
                <svg viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-title">Pendientes</div>
                <div className="stat-value">{statusCounts.pendiente}</div>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div
            onClick={() => setActiveFilter("en progreso")}
            className={`stat-card ${
              activeFilter === "en progreso" ? "active" : ""
            }`}
          >
            <div className="stat-content">
              <div className="stat-icon-container bg-blue">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-title">En Progreso</div>
                <div className="stat-value">{statusCounts["en progreso"]}</div>
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div
            onClick={() => setActiveFilter("resuelto")}
            className={`stat-card ${
              activeFilter === "resuelto" ? "active" : ""
            }`}
          >
            <div className="stat-content">
              <div className="stat-icon-container bg-green">
                <svg viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-title">Resueltos</div>
                <div className="stat-value">{statusCounts.resuelto}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="tickets-container">
          {/* Table Header */}
          <div className="tickets-header">
            <div className="header-info">
              <h2>Tickets de Servicio</h2>
              <p>
                Gestión de todos tus tickets de mantenimiento y soporte técnico.
              </p>
            </div>
            <div className="search-container">
              <div className="search-input-container">
                <svg viewBox="0 0 20 20">
                  <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="clear-search"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading/Error/Empty States */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando tickets...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div>
              <div className="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>No se encontraron tickets</h3>
                <p>
                  {activeFilter !== "all" || searchQuery
                    ? "Intenta con otros filtros o términos de búsqueda."
                    : "Empieza creando un nuevo ticket de servicio."}
                </p>
              </div>
              <button
                onClick={handleCreateTicket}
                className="create-ticket-btn"
              >
                <svg viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Nuevo Ticket
              </button>
            </div>
          ) : (
            <div className="tickets-table-container">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Detalles</th>
                    <th>Equipo</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fechas</th>
                    <th className="actions-column">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className="ticket-row"
                    >
                      <td>
                        <div className="ticket-details">
                          <div className="ticket-icon">
                            {getTypeIcon(ticket.type)}
                          </div>
                          <div className="ticket-info">
                            <div className="ticket-title">{ticket.title}</div>
                            <div className="ticket-description">
                              {ticket.description}
                            </div>
                            <div className="ticket-location">
                              <svg viewBox="0 0 24 24">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {ticket.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ticket-equipment">
                          <div className="equipment-model">
                            {ticket.fridgeModel}
                          </div>
                          <div className="equipment-type">{ticket.type}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`priority-badge ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        <div className="ticket-dates">
                          <div>Creado: {formatDate(ticket.createdAt)}</div>
                          <div>Vence: {formatDate(ticket.dueDate)}</div>
                        </div>
                      </td>
                      <td className="actions-column">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketClick(ticket.id);
                          }}
                          className="view-btn"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleCreateTicket}
                className="create-ticket-btn"
              >
                <svg viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Nuevo Ticket
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
