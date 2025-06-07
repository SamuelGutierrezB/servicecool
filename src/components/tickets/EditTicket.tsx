import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TicketService, TicketInput } from "../../services/ticket.service";
import "./EditTicket.css";

const EditTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState<TicketInput>({
    title: "",
    description: "",
    status: "pendiente",
    priority: "media",
    location: "",
    fridgeModel: "",
    type: "falla",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) {
          throw new Error("ID de ticket no proporcionado");
        }

        const ticket = await TicketService.getTicketById(id);
        if (!ticket) {
          throw new Error("Ticket no encontrado");
        }

        setTicketData({
          title: ticket.get("title"),
          description: ticket.get("description"),
          status: ticket.get("status"),
          priority: ticket.get("priority"),
          location: ticket.get("location"),
          fridgeModel: ticket.get("fridgeModel"),
          type: ticket.get("type"),
          dueDate: ticket.get("dueDate"),
        });
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar el ticket"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTicketData((prev) => ({
      ...prev,
      dueDate: value ? new Date(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await TicketService.updateTicket(id, ticketData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al actualizar el ticket"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")} className="error-link">
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-ticket-container">
      <div className="edit-ticket-header">
        <h2 className="edit-ticket-title">Editar Ticket</h2>
        <p className="edit-ticket-description">
          Actualiza los detalles del problema o mantenimiento requerido.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="edit-ticket-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={ticketData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={ticketData.description}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            value={ticketData.type}
            onChange={handleChange}
            className="form-input"
          >
            <option value="falla">Falla técnica</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="revisión">Revisión</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={ticketData.priority}
            onChange={handleChange}
            className="form-input"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={ticketData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="resuelto">Resuelto</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Ubicación
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={ticketData.location}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fridgeModel" className="form-label">
            Modelo de Refrigerador
          </label>
          <input
            type="text"
            name="fridgeModel"
            id="fridgeModel"
            value={ticketData.fridgeModel}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Fecha de Vencimiento (opcional)
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={
              ticketData.dueDate
                ? new Date(ticketData.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleDateChange}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="cancel-btn"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-btn ${isSubmitting ? "loading" : ""}`}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTicket;
