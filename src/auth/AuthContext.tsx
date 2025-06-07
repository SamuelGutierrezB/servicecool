import React, { createContext, useContext, useEffect, useState } from "react";
import Parse from "parse";

interface AuthContextType {
  user: Parse.User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Parse.User | null>(null);

  // Verificar usuario al cargar
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await Parse.User.currentAsync();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    checkCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await Parse.User.logIn(email, password);
      setUser(user);
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const user = new Parse.User();
      user.set("username", username);
      user.set("email", email);
      user.set("password", password);
      await user.signUp();
      setUser(user);
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  };

  const logout = async () => {
    try {
      await Parse.User.logOut();
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
