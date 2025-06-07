import Parse from "parse";

export const initializeParse = () => {
  Parse.initialize(
    process.env.REACT_APP_BACK4APP_APP_ID || "",
    process.env.REACT_APP_BACK4APP_JS_KEY || ""
  );
  Parse.serverURL = "https://parseapi.back4app.com/";
};

export const parseConfig = {
  appId: process.env.REACT_APP_BACK4APP_APP_ID || "",
  javascriptKey: process.env.REACT_APP_BACK4APP_JS_KEY || "",
  serverURL: "https://parseapi.back4app.com/",
};
