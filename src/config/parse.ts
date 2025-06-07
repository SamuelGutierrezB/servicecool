import Parse from "parse";

// Configuración directa con verificación
if (!Parse.applicationId) {
  Parse.initialize(
    process.env.REACT_APP_BACK4APP_APP_ID ||
      "8NRD7pGuAcJotYf2OIsAbcGgKR0WA6qMNXCrAYw4",
    process.env.REACT_APP_BACK4APP_JS_KEY ||
      "c5yKz1XW0R6htkdlz4sKQCOMV94kE0OaxOJs43Ax"
  );
  Parse.serverURL = "https://parseapi.back4app.com/";
  console.log("Parse inicializado correctamente"); // Debug
}

export const parseConfig = {
  appId:
    process.env.REACT_APP_BACK4APP_APP_ID ||
    "8NRD7pGuAcJotYf2OIsAbcGgKR0WA6qMNXCrAYw4",
  javascriptKey:
    process.env.REACT_APP_BACK4APP_JS_KEY ||
    "c5yKz1XW0R6htkdlz4sKQCOMV94kE0OaxOJs43Ax",
  serverURL: "https://parseapi.back4app.com/",
};
