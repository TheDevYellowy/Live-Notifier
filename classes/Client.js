const { Client, Collection, REST, Routes } = require('discord.js');
const readdir = require('util').promisify(require('node:fs').readdir);

const api = require('../util/api');
const EventSub = require('../util/eventSub');

module.exports = class LiveNotifier extends Client {
  constructor(intents = 0) {
    super({
      intents,
      ws: { properties: { browser: 'Discord iOS' } }
    });

    this.api = api;
    this.eventSub = new EventSub();
    this.config = require('../config.json').discord;

    this.commands = new Collection();
    this.REST = new REST({ version: '10' }).setToken(this.config.token);
  }

  /** @private */
  async loadCommand(cmdName) {
    try {
      const props = new (require(`../commands/${cmdName}`))(this);
      if (props.init) {
        props.init(this);
      }

      this.commands.set(props.name, props);
      const data = props.toJSON();
      await this.REST.post(Routes.applicationCommands(this.config.client_id), { body: data });

      return false
    } catch (e) {
      return `Unable to load command ${cmdName}: ${e}`;
    }
  }

  async loadCommands() {
    const commands = await readdir('./commands/');
    console.log(`Loading ${commands.length} command(s)`);
    commands.filter(cmd => cmd.split('.').pop() === 'js').forEach(async cmd => {
      const res = await this.loadCommand(cmd);
      if (res) console.log(res);
    });
  }

  async loadEvents() {
    const evtFiles = await readdir(`./events`);
    console.log(`Loading ${evtFiles.length} event(s)`);
    evtFiles.forEach(file => {
      const eventName = file.split('.')[0];
      const event = new (require(`../events/${file}`))(this);
      this.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`../events/${file}`)];
    });
  }
}