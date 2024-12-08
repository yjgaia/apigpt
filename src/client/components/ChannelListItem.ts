import { DomNode, Router } from "@common-module/app";
import ChannelNameManager from "../data-managers/ChannelNameManager.js";

export default class ChannelListItem extends DomNode {
  constructor(channel: string) {
    super(".channel-list-item");
    this.onDom("click", () => Router.go(`/${channel}`));

    this.setName(ChannelNameManager.getChannelName(channel) ?? "Unknown");
    ChannelNameManager.on("changed", (_channel, name) => {
      if (channel === _channel) this.setName(name);
    });
  }

  public setName(name: string) {
    this.text = name;
  }
}
