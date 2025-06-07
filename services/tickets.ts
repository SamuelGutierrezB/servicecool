import Parse, { Ticket } from "./parse";

export interface ITicket {
  title: string;
  description: string;
  status: "pendiente" | "en progreso" | "resuelto";
  priority: "alta" | "media" | "baja";
  location: string;
  fridgeModel: string;
  type: "mantenimiento" | "revisión" | "falla";
  dueDate?: Date;
}

export const TicketService = {
  async createTicket(ticketData: ITicket) {
    // Crear instancia de Ticket usando la clase registrada
    const ticket = new Ticket();

    // Setear valores
    ticket.set("title", ticketData.title);
    ticket.set("description", ticketData.description);
    ticket.set("status", "pendiente"); // Estado inicial
    ticket.set("priority", ticketData.priority);
    ticket.set("location", ticketData.location);
    ticket.set("fridgeModel", ticketData.fridgeModel);
    ticket.set("type", ticketData.type);

    // Relación con el usuario actual
    const currentUser = Parse.User.current();
    if (currentUser) {
      ticket.set("client", currentUser);
    }

    if (ticketData.dueDate) {
      ticket.set("dueDate", ticketData.dueDate);
    }

    try {
      const result = await ticket.save();
      return result;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  async getTicketsByUser() {
    const currentUser = Parse.User.current();
    if (!currentUser) return [];

    const query = new Parse.Query(Ticket);

    query.equalTo("client", currentUser);
    query.include("client"); // Incluye los datos del cliente
    query.descending("createdAt"); // Ordenar por fecha de creación

    try {
      const results = await query.find();
      return results.map((ticket) => ({
        id: ticket.id,
        ...ticket.attributes,
      }));
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },

  async updateTicketStatus(ticketId: string, status: string) {
    const Ticket = Parse.Object.extend("Ticket");
    const query = new Parse.Query(Ticket);

    try {
      const ticket = await query.get(ticketId);
      ticket.set("status", status);
      const result = await ticket.save();
      return result;
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  },

  async deleteTicket(ticketId: string) {
    const Ticket = Parse.Object.extend("Ticket");
    const ticket = new Ticket();
    ticket.id = ticketId;

    try {
      await ticket.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  },

  async getTicketById(id: string) {
    const query = new Parse.Query(Ticket);
    try {
      const ticket = await query.get(id);
      return {
        id: ticket.id,
        ...ticket.attributes,
        dueDate: ticket.get("dueDate")?.toISOString(), // Convertir a string
      };
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  },

  async updateTicket(id: string, ticketData: Partial<ITicket>) {
    const query = new Parse.Query(Ticket);
    try {
      const ticket = await query.get(id);

      // Actualizar solo los campos que han cambiado
      if (ticketData.title) ticket.set("title", ticketData.title);
      if (ticketData.description)
        ticket.set("description", ticketData.description);
      if (ticketData.status) ticket.set("status", ticketData.status);
      if (ticketData.priority) ticket.set("priority", ticketData.priority);
      if (ticketData.location) ticket.set("location", ticketData.location);
      if (ticketData.fridgeModel)
        ticket.set("fridgeModel", ticketData.fridgeModel);
      if (ticketData.type) ticket.set("type", ticketData.type);
      if (ticketData.dueDate) {
        const dueDate =
          ticketData.dueDate instanceof Date
            ? ticketData.dueDate
            : new Date(ticketData.dueDate);
        ticket.set("dueDate", dueDate);
      }

      const result = await ticket.save();
      return result;
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  },
};
