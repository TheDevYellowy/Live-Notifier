const Command = require('../classes/Command');
const { CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = class command extends Command {
  constructor(client) {
    super(client, {
      name: 'adduser',
      description: 'Add a user to the list of people'
    });
    this.client = client;
  }

  /** @param {CommandInteraction} int */
  async exec(int) {
    const modal = new ModalBuilder()
      .setCustomId('add')
      .setTitle('Add a user');

    const twitch = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Twitch username')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const discord = new TextInputBuilder()
      .setCustomId('discord')
      .setLabel('Discord id (not required)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const one = new ActionRowBuilder().addComponents(twitch);
    const two = new ActionRowBuilder().addComponents(discord);

    modal.addComponents(one, two);

    await int.showModal(modal);
  }
}