import { DomNode } from "@common-module/app";

export default class ChannelList extends DomNode {
  constructor() {
    super(".channel-list");
  }

  public addChannel(channel: string): void {
  }

  public setChannels(channels: string[]): void {
    for (const channel of channels) {
      this.addChannel(channel);
    }
  }
}
