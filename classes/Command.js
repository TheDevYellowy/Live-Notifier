module.exports = class Command {
  constructor(client, {
    name = null,
    description = null,
    options = Array(),
  }) {
    this.name = name;
    this.description = description;
    this.options = options;
  }

  toJSON() {
    return {
      ...this
    }
  }
}