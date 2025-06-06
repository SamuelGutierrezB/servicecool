import AsyncStorage from "@react-native-async-storage/async-storage";
import Parse from "parse/react-native";

// Inicialización
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "8NRD7pGuAcJotYf2OIsAbcGgKR0WA6qMNXCrAYw4",
  "c5yKz1XW0R6htkdlz4sKQCOMV94kE0OaxOJs43Ax"
); // Reemplaza con tus credenciales
Parse.serverURL = "https://parseapi.back4app.com/";

// Registra las subclases (para relaciones)
Parse.Object.registerSubclass("Ticket", () => {
  return Parse.Object.extend("Ticket");
});

export default Parse;
