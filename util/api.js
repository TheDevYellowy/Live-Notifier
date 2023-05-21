const baseURL = 'https://api.twitch.tv/helix/';
const fs = require('node:fs');

var config = require('../config.json');
var expires = config.twitch.expires_in;

async function get(url) {
  if (Date.now() > expires) config = await resetToken();
  const res = await fetch(`${baseURL}${url}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${config.twitch.access_token}`,
      'Client-Id': config.twitch.client_id
    }
  });

  if (res.status == 401 && !config.twitch.refresh_token) return `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${config.twitch.client_id}&redirect_uri=http://localhost/api&scope=`;
  else if (res.status == 401) {
    config = await resetToken();
    return get(url);
  }
  return await res.json();
}

async function post(url, headers, data, auth = true) {
  if (Date.now() > expires) config = await resetToken();
  if (auth) headers = {
    'Authorization': `Bearer ${config.twitch.access_token}`,
    'Client-Id': config.twitch.client_id,
    ...headers
  };
  else headers = {
    'Client-Id': config.twitch.client_id,
    ...headers
  }

  const res = await fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });

  if (res.status == 401 && !config.twitch.refresh_token) return `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${config.twitch.client_id}&redirect_uri=http://localhost/api&scope=`;
  else if (res.status == 401) {
    config = await resetToken();
    return post(url, headers, data, auth);
  }
  return await res.json();
}

async function Delete(url) {
  if (Date.now() > expires) config = await resetToken();
  const res = await fetch(`${baseURL}${url}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${config.twitch.access_token}`,
      'Client-Id': config.twitch.client_id
    }
  });
  let json = await res.json();
  if (res.status == 401 && !config.twitch.refresh_token) return `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${config.twitch.client_id}&redirect_uri=http://localhost/api&scope=`;
  else if (res.status == 401) {
    config = await resetToken();
    return Delete(url);
  }
  else console.log(json); return json;
}

async function resetToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${config.twitch.client_id}&client_secret=${config.twitch.client_secret}&grant_type=refresh_token&refresh_token=${config.twitch.refresh_token}`, {
    method: "POST",
    headers: {
      "Content-Type": "x-www-form-urlencoded"
    }
  });

  var data;
  if (res.ok) {
    data = await res.json();
    console.log(data);
    config.twitch.access_token = data.access_token;
    config.twitch.refresh_token = data.refresh_token;
    expires = config.twitch.expires_in = (Date.now() + (data.expires_in * 1000));
    fs.writeFileSync(`${process.cwd()}/config.json`, JSON.stringify(config, null, 2));
  } else {
    data = await res.json();
    console.log(data);
  }
  return config;
}

module.exports = { post, get, Delete };