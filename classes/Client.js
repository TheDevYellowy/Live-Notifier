const { Client, Collection } = require('discord.js');
const api = require('../util/api');
const EventSub = require('../util/eventSub');

module.exports = class LiveNotifier extends Client {
  constructor() {
    super({
      intents: [],
      ws: { properties: { browser: 'Discord iOS' } }
    });

    this.api = api;
    this.eventSub = new EventSub();

    this.commands = new Collection();
  }
}