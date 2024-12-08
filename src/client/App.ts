import { BodyNode, el, Router, View } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { v4 as uuidv4 } from "uuid";
import ChannelList from "./components/ChannelList.js";
import ChatRoom from "./components/ChatRoom.js";
import ChannelManager from "./data-managers/ChannelManager.js";
import MessageManager from "./data-managers/MessageManager.js";

export default class App extends View {
  private currentChannel: string | undefined;

  private channelList: ChannelList;
  private chatRoom: ChatRoom;

  constructor() {
    super();

    BodyNode.append(
      this.container = el(
        "#app",
        el(
          ".channel-list-container",
          new Button({
            type: ButtonType.Contained,
            title: "New Channel",
            onClick: () => Router.go(`/${uuidv4()}`),
          }),
          this.channelList = new ChannelList(),
        ),
        this.chatRoom = new ChatRoom(),
      ),
    );

    if (MessageManager.isConnected()) this.init();
    MessageManager.on("connected", () => this.init());
    MessageManager.on("messageChunk", (targetMessageId, chunk) => {
      this.chatRoom.addMessageChunk(targetMessageId, chunk);
    });
  }

  public changeData(data: { channel?: string }): void {
    if (!data.channel) {
      Router.go(`/${uuidv4()}`);
    } else {
      this.currentChannel = data.channel;
      if (MessageManager.isConnected()) this.joinChannel(data.channel);
    }
  }

  private init() {
    this.loadChannels();
    if (this.currentChannel) this.joinChannel(this.currentChannel);
  }

  private async loadChannels() {
    const channels = await ChannelManager.getAllChannels();
    this.channelList.setChannels(channels);
  }

  private joinChannel(channel: string) {
    this.chatRoom.joinChannel(channel);
    this.channelList.addChannel(channel);
  }
}
