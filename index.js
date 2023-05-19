console.clear();

const Client = require('./classes/Client');
const channels = require('./channels.json').channels;
const client = new Client();
const { User, EmbedBuilder, TextChannel } = require('discord.js');

require('./util/backend');

client.eventSub.on('live', async event => {
  console.log(event);
  const channels = require('./channels.json');
  const username = event.broadcaster_user_name;
  const userId = event.broadcaster_user_id;
  const url = `https://twitch.tv/${username}`;

  var data = await client.api.get(`streams?user_id=${userId}`);
  data = data?.data[0];
  if (!data) return;
  let title = data.title;

  /** @type {?User} */
  let user;
  for (const pair of channels.channels) {
    if (pair.t != userId) { }
    else user = await client.users.fetch(pair.d);
  }
  if (user == undefined) return;
  let image = data.thumbnail_url;
  image = image.replace('{width}', '400');
  image = image.replace('{height}', '300');

  const embed = new EmbedBuilder();
  embed
    .setAuthor({
      iconURL: user.displayAvatarURL(),
      name: user.username
    })
    .setThumbnail(user.displayAvatarURL())
    .setTitle(title)
    .setURL(url)
    .setImage(image)
    .addFields(
      { name: 'Game', value: data.game_name },
      { name: 'Viewers', value: data.viewer_count }
    );

  /** @type {?TextChannel} */
  const channel = await client.channels.fetch(client.config.channel_id);
  if (channel == undefined) return console.log(`For some reason I can't resolve the channel`);

  channel.send({
    content: `How're you doing <@1103947748698505269>, ${username} is currently live`,
    embeds: [embed.data]
  });
});

client.eventSub.on('online', () => {
  channels.forEach(async (v, i) => {
    await client.eventSub.subscribe('stream.online', '1', {
      "broadcaster_user_id": v.t
    });
  });
})

client.loadCommands();
client.loadEvents();
client.login(client.config.token);
client.eventSub.connect();