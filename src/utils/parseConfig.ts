import Parse from "parse";

Parse.initialize(
  process.env.REACT_APP_PARSE_APP_ID || "",
  process.env.REACT_APP_PARSE_JS_KEY || ""
);
Parse.serverURL = process.env.REACT_APP_PARSE_SERVER_URL || "";

export default Parse;
