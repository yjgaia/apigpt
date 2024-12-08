import { Router } from "@common-module/app";
import { GaiaUIPreset } from "@gaiaprotocol/ui-preset";
import App from "./App.js";
import MessageManager from "./data-managers/MessageManager.js";

GaiaUIPreset.init();

MessageManager.on("connected", () => {
  Router.add(["/", "/:channel"], App);
});
