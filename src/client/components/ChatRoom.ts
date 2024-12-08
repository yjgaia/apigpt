import { DomNode } from "@common-module/app";

export default class ChatRoom extends DomNode {
  constructor() {
    super(".chat-room");
  }

  public joinChannel(channelId: string): void {
    console.log(`Joining channel ${channelId}`);
  }
}
