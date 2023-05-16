const Client = require('./classes/Client');
const client = new Client();
const { User, EmbedBuilder, TextChannel } = require('discord.js');

require('./util/backend');

client.eventSub.on('live', async event => {
  console.log(event);
  const channels = require('./channels.json')
  const username = event.broadcaster_user_name;
  const userId = event.broadcaster_user_id;
  const url = `https://twitch.tv/${username}`;

  var data = await client.api.get(`channels?broadcaster_id=${userId}`);
  data = data?.data[0];
  if (!data) return;
  let title = data.title;

  /** @type {?User} */
  let user;
  for (const pair of channels.channels) {
    if (pair.t != userId) { }
    else user = client.users.cache.get(pair.d);
  }
  if (user == undefined) return;

  const embed = new EmbedBuilder();
  embed
    .setAuthor({
      iconURL: user.displayAvatarURL(),
      name: user.username
    })
    .setThumbnail(user.displayAvatarURL())
    .setTitle(title)
    .setURL(url);

  /** @type {?TextChannel} */
  const channel = await client.channels.fetch(client.config.channel_id);
  if (channel == undefined) return console.log(`For some reason I can't resolve the channel`);

  channel.send({
    content: `How're you doing <@1103947748698505269>, ${username} is currently live`,
    embeds: [embed.data]
  });
});

client.eventSub.on('raw', packet => {
  let metadata = packet.metadata;
  let payload = packet.payload;
  console.log({ metadata, payload });
});

client.loadCommands();
client.loadEvents();
client.login(client.config.token);
client.eventSub.connect();