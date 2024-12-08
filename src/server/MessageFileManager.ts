import { FileUtils } from "@common-module/server";
import Message from "../data/Message.js";

class MessageFileManager {
  public async readChannels(): Promise<string[]> {
    const files = await FileUtils.getAllFiles("./messages");
    return files.map((file) =>
      file.replace("messages/", "").replace(".json", "")
    );
  }

  public async removeChannel(channel: string) {
    await FileUtils.deleteFile(`./messages/${channel}.json`);
  }

  public async readMessages(channel: string): Promise<Message[]> {
    if (
      await FileUtils.checkFileExists(`./messages/${channel}.json`) !== true
    ) {
      return [];
    }
    const content = await FileUtils.readText(`./messages/${channel}.json`);
    return JSON.parse(content);
  }

  public async writeMessages(channel: string, messages: Message[]) {
    await FileUtils.write(
      `./messages/${channel}.json`,
      JSON.stringify(messages, null, 2),
    );
  }
}

export default new MessageFileManager();
