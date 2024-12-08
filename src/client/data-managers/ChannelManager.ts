import Config from "../../Config.js";

const config = (window as any).config as Config;

class ChannelManager {
  public async getAllChannels() {
    const response = await fetch(`${config.serverUrl}/api/rooms`);
    return await response.json();
  }

  public async removeChannel(channel: string) {
    await fetch(`${config.serverUrl}/api/room/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel }),
    });
  }
}

export default new ChannelManager();
