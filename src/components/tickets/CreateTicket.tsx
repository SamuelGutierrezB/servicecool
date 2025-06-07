import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TicketService, TicketInput } from "../../services/ticket.service";
import "./CreateTicket.css";

const CreateTicket: React.FC = () => {
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
    setIsSubmitting(true);
    setError(null);

    try {
      await TicketService.createTicket(ticketData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear el ticket"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-header">
        <h2 className="create-ticket-title">Crear Nuevo Ticket</h2>
        <p className="create-ticket-description">
          Completa los detalles del problema o mantenimiento requerido.
        </p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-ticket-form">
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
            {isSubmitting ? "Creando..." : "Crear Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
