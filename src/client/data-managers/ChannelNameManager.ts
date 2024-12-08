import { Store } from "@common-module/app";
import { EventContainer } from "@common-module/ts";

class ChannelNameManager extends EventContainer<{
  changed: (channel: string, name: string) => void;
}> {
  private store = new Store("channel-names");

  public getChannelName(channel: string): string | undefined {
    return this.store.get(channel);
  }

  public setChannelName(channel: string, name: string): void {
    this.store.setPermanent(channel, name);
    this.emit("changed", channel, name);
  }
}

export default new ChannelNameManager();
