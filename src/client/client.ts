import { Router } from "@common-module/app";
import { SocialCompConfig } from "@common-module/social-components";
import { GaiaUIPreset } from "@gaiaprotocol/ui-preset";
import App from "./App.js";
import MessageManager from "./data-managers/MessageManager.js";

GaiaUIPreset.init();

SocialCompConfig.fetchUser = (userId: string) => {
  if (userId === "user") {
    return {
      id: "user",
      name: "User",
      avatar: "👤",
    };
  } else if (userId === "assistant") {
    return {
      id: "assistant",
      name: "Assistant",
      avatar: "🤖",
    };
  } else {
    return {
      id: "unknown",
      name: "Unknown",
      avatar: "❓",
    };
  }
};

MessageManager.on("connected", () => {
  Router.add(["/", "/:channel"], App);
});
