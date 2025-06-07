import Parse from "parse";

export interface UserCredentials {
  username: string;
  password: string;
  email?: string; // Opcional para el registro
}

export const AuthService = {
  async login({ username, password }: UserCredentials): Promise<Parse.User> {
    try {
      const user = await Parse.User.logIn(username, password);

      return user;
    } catch (error) {
      throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  },

  async register({
    username,
    password,
    email,
  }: UserCredentials): Promise<Parse.User> {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
      console.log("Usuario registrado:");
      await user.signUp();
      return user;
    } catch (error) {
      throw new Error(
        "Error al registrar el usuario. Intenta con otro nombre de usuario o correo."
      );
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
