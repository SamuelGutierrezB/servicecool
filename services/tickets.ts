import Parse from "./parse";

export interface Ticket {
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
  async createTicket(ticketData: Ticket) {
    const Ticket = Parse.Object.extend("Ticket");
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
    ticket.set("client", currentUser);

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
    const Ticket = Parse.Object.extend("Ticket");
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
};
