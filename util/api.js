const baseURL = 'https://api.twitch.tv/helix/';
const fs = require('node:fs');

var config = require('../config.json');
var expires = config.twitch.expires_in;

async function get(url) {
  if (Date.now() > expires) config = await getToken();
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: {
      'Authorization': config.twitch.access_token,
      'Client-Id': config.twitch.client_id
    }
  });

  if (res.status == 401) return 'Access token invalid'
  return await res.json();
}

async function post(url, headers, data) {
  if (Date.now() > expires) config = await getToken();
  headers = {
    'Authorization': config.twitch.access_token,
    'Client-Id': config.twitch.client_id,
    ...headers
  }

  const res = await fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });

  if (res.status == 401) return 'Access token invalid'
  return await res.json();
}

async function getToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${config.twitch.client_id}&client_secret=${config.twitch.client_secret}&grant_type=client_credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "x-www-form-urlencoded"
    }
  });

  var data;
  if (res.ok) {
    data = await res.json();
    config.twitch.access_token = data.access_token;
    expires = config.twitch.expires_in = (Date.now() + data.expires_in);
    fs.writeFileSync(`${process.cwd()}/config.json`, JSON.stringify(config, null, 2));
  }
  return config;
}

module.exports = { post, get };