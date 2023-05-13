module.exports = class Command {
  constructor(client, {
    name = null,
    description = null
  }) {
    this.client = client;
    this.name = name;
    this.description = description;
  }

  toJSON() {
    let name = this.name;
    let description = this.description;
    return {
      name, description
    }
  }
}