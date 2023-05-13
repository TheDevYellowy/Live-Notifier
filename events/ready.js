module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    this.client.user.setActivity('Shit', {
      type: 'STREAMING',
      url: `https://twitch.tv/yellowyttv`
    });

    console.log(`${this.client.user.username} is online and ready`);
  }
}