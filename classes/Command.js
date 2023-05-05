module.exports = class Command {
  constructor(client, {
    name = null,
    description = null
  }) {
    this.client = client;
    this.name = name;
    this.description = description;
  }
}