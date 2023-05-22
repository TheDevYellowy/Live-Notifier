console.clear();

const Client = require('./classes/Client');
const channels = require('./channels.json').channels;
const client = new Client();
const { User, EmbedBuilder, TextChannel } = require('discord.js');

const sleep = require('node:util').promisify(setTimeout);

require('./util/backend');
require('./antiCrash')(client);

client.eventSub.on('live', async event => {
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

client.eventSub.on('raw', (packet) => {
  if (packet.metadata.message_type === 'session_keepalive') return;
  if (client.config.webhook_url === '') return;
  const data = {
    username: 'Live Bot Raw Packets',
    content: `\`\`\`json\n${JSON.stringify(packet, null, 2)}\n\`\`\``,
    embeds: []
  };

  fetch(client.config.webhook_url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(async (res) => {
    if (!res.ok) {
      let d = await res.json();
      console.log(d);
    }
  });
});

client.eventSub.on('debug', (msg) => {
  if (client.config.webhook_url === '') return;
  if (typeof msg === 'object') msg = `\`\`\`json\n${JSON.stringify(msg, null, 2)}\n\`\`\``;

  fetch(client.config.webhook_url, {
    method: 'POST',
    body: JSON.stringify({
      username: 'Live Bot Debug',
      content: msg
    }),
    headers: {
      'Content-Type': "application/json"
    }
  }).then(async (res) => {
    if (!res.ok) {
      let d = await res.json();
      console.log(d);
    }
  });
})

client.eventSub.on('online', async () => {
  await beforeSubscriptions();
  for (let i = 0; i < channels.length; i++) {
    let v = channels[i];
    await client.eventSub.subscribe('stream.online', '1', {
      "broadcaster_user_id": v.t
    });
  }
});

async function beforeSubscriptions() {
  const events = await client.api.get('eventsub/subscriptions');
  for (let i = 0; i < events.total; i++) {
    const data = events.data[i];
    await client.api.Delete(`eventsub/subscriptions?id=${data.id}`);
    await sleep(500);
  }
}

client.loadCommands();
client.loadEvents();
client.login(client.config.token);
client.eventSub.connect();