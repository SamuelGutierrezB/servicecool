import Parse from "parse";

export interface UserCredentials {
  username: string;
  password: string;
  email?: string;
}

export const AuthService = {
  async login({ username, password }: UserCredentials): Promise<Parse.User> {
    try {
      const user = await Parse.User.logIn(username, password);
      console.log("Login exitoso:", user); // Debug
      return user;
    } catch (error: any) {
      // Tipado más específico
      console.error("Error en login:", error); // Debug
      throw new Error(
        error.message || "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  },

  async register({
    username,
    password,
    email,
  }: UserCredentials): Promise<Parse.User> {
    console.log("Iniciando registro con:", { username, email }); // Debug
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
      const registeredUser = await user.signUp();
      console.log("Usuario registrado con éxito:", registeredUser); // Debug
      return registeredUser;
    } catch (error: any) {
      console.error("Error detallado en registro:", error); // Debug
      if (error.code) {
        switch (error.code) {
          case 202:
            throw new Error("Nombre de usuario ya existe");
          case 203:
            throw new Error("Email ya está registrado");
          case 125:
            throw new Error("Email no válido");
          default:
            throw new Error(`Error ${error.code}: ${error.message}`);
        }
      }
      throw error;
    }
  },

  logout(): Promise<void> {
    return Parse.User.logOut();
  },

  getCurrentUser(): Parse.User | null {
    return Parse.User.current();
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
