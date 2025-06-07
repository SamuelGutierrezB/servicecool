import Parse from "parse";

export interface TicketInput {
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
  async createTicket(ticketData: TicketInput): Promise<Parse.Object> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      const Ticket = Parse.Object.extend("Ticket");
      const ticket = new Ticket();

      ticket.set("title", ticketData.title);
      ticket.set("description", ticketData.description);
      ticket.set("status", "pendiente"); // Estado por defecto
      ticket.set("priority", ticketData.priority);
      ticket.set("client", currentUser);
      ticket.set("location", ticketData.location);
      ticket.set("fridgeModel", ticketData.fridgeModel);
      ticket.set("type", ticketData.type);
      if (ticketData.dueDate) {
        ticket.set("dueDate", ticketData.dueDate);
      }

      const savedTicket = await ticket.save();
      return savedTicket;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  async getTicketById(id: string): Promise<Parse.Object | null> {
    try {
      const Ticket = Parse.Object.extend("Ticket");
      const query = new Parse.Query(Ticket);
      const ticket = await query.get(id);
      return ticket;
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return null;
    }
  },

  async updateTicket(
    id: string,
    ticketData: Partial<TicketInput>
  ): Promise<Parse.Object> {
    try {
      const ticket = await this.getTicketById(id);
      if (!ticket) {
        throw new Error("Ticket no encontrado");
      }

      Object.entries(ticketData).forEach(([key, value]) => {
        if (value !== undefined) {
          ticket.set(key, value);
        }
      });

      const updatedTicket = await ticket.save();
      return updatedTicket;
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  },

  async getUserTickets(): Promise<Parse.Object[]> {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      const Ticket = Parse.Object.extend("Ticket");
      const query = new Parse.Query(Ticket);
      query.equalTo("client", currentUser);
      query.descending("createdAt");
      const tickets = await query.find();
      return tickets;
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      throw error;
    }
  },
};
