const { Interaction } = require('discord.js');
const Client = require('../classes/Client');
const channels = require('../channels.json');
const fs = require('node:fs');

module.exports = class {
  /** @param {Client} client */
  constructor(client) {
    this.client = client;
  }

  /** @param {Interaction} int */
  async run(int) {
    if (int.isCommand()) {
      const cmd = this.client.commands.get(int.commandName);
      try {
        cmd.exec(int);
      } catch (e) {
        int.reply({ ephemeral: true, content: `There seems to have been an error, if this persists please msg Yellowy#0001` });
        console.log(`${int.commandName}: ${e}`);
      }
    } else if (int.isModalSubmit()) {
      var name = int.fields.getTextInputValue('name');
      var discord = int.fields.getTextInputValue('discord');
      var data = await this.client.api.get(`users?login=${name}`);
      data = data?.data[0];
      let res = await this.client.eventSub.subscribe(
        'channel.online',
        '1',
        {
          broadcaster_user_id: data.id
        }
      )
      if (!res) int.reply({ ephemeral: true, content: `Something went wrong when subscribing to the event, tell Yellowy#0001 and they'll do something about it.` });

      channels.channels.push({ d: int.user.id, t: data.id });
      fs.writeFileSync(`${process.cwd()}/channels.json`, JSON.stringify(channels, null, 2));

      int.reply({ ephemeral: true, content: `Successfully added ${name}` });
    }
  }
}