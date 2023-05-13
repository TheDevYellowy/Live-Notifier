const { ActivityType } = require('discord.js');
const Client = require('../classes/Client');

module.exports = class {
  constructor(client) {
    /** @type {Client} */
    this.client = client;
  }

  async run() {
    this.client.user.setActivity({
      name: 'Shit',
      type: ActivityType.Streaming,
      url: `https://twitch.tv/yellowyttv`
    });

    console.log(`${this.client.user.username} is online and ready`);
  }
}