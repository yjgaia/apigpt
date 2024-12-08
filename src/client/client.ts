import { Router } from "@common-module/app";
import App from "./App.js";

Router.add(["/", "/:channel"], App);
