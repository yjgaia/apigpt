import { DomNode } from "@common-module/app";
import ChannelListItem from "./ChannelListItem.js";

export default class ChannelList extends DomNode {
  private channels: string[] = [];

  constructor() {
    super(".channel-list");
  }

  public addChannel(channel: string): void {
    if (this.channels.includes(channel)) return;

    this.channels.splice(0, 0, channel);
    new ChannelListItem(channel).appendTo(this, 0);
  }

  public setChannels(channels: string[]): void {
    this.channels = channels;

    this.clear();
    for (const channel of channels) {
      this.append(new ChannelListItem(channel));
    }
  }
}
