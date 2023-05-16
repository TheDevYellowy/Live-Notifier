const express = require("express");
const app = express();

const fs = require('node:fs');
const path = require('node:path');
const conf = require('../config.json');

app.get('/api', async (req, res) => {
  if (req.query.error) return;
  if (!req.query.code) return;

  const params = new URLSearchParams();
  params.set('client_id', conf.twitch.client_id);
  params.set('client_secret', conf.twitch.client_secret);
  params.set('code', req.query.code);
  params.set('grant_type', 'authorization_code');
  params.set('redirect_uri', 'http://localhost/api');

  let response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const tokens = await response.json();
  if (tokens.error || !tokens.access_token) return res.redirect(req.originalUrl);

  conf.twitch.access_token = tokens.access_token;
  conf.twitch.expires_in = (Date.now() + (tokens.expires_in * 1000));
  conf.twitch.refresh_token = tokens.refresh_token;

  fs.writeFileSync(`./config.json`, JSON.stringify(conf, null, 2));
  res.redirect(`https://twitch.tv/yellowyttv`);
});

app.listen(80, () => console.log(`[BACKEND] Online`));