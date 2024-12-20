import { WebServerOptions } from "@common-module/server";

export default interface Config extends WebServerOptions {
  openAIApiKey: string;
  serverUrl: string;
}
