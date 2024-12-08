import { Router } from "@common-module/app";
import App from "./App.js";
import MessageManager from "./data-managers/MessageManager.js";

MessageManager.on("connected", () => {
  Router.add(["/", "/:channel"], App);
});
