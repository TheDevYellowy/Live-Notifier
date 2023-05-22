const { WebSocket } = require('ws');
const { EventEmitter } = require('node:events');
const td = new TextDecoder();

const { post } = require('./api');

module.exports = class EventSub extends EventEmitter {
  constructor() {
    super();
    /** @type {?WebSocket} */
    this.connection = null;
    this.connectedAt = null;
    this.id = null;
  }

  connect(url = null) {
    let connectURL;
    if (this.connection?.readyState == WebSocket.OPEN) return Promise.resolve();

    if (url == null) connectURL = 'wss://eventsub.wss.twitch.tv/ws';
    else connectURL = url;

    return new Promise((resolve, reject) => {
      this.connectedAt = Date.now();
      const ws = this.connection = new WebSocket(connectURL);

      ws.onopen = this.onOpen.bind(this);
      ws.onmessage = this.onMessage.bind(this);
    });
  }

  onOpen() {
    this.debug(`[CONNECTED] took ${Date.now() - this.connectedAt}ms`);
  }

  onMessage({ data }) {
    let raw;
    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    raw = data;
    if (typeof raw !== 'string') raw = td.decode(raw);
    let packet = JSON.parse(raw);
    this.emit('raw', packet);

    this.onPacket(packet)
  }

  async onPacket(packet) {
    if (!packet) {
      this.debug(`Recieved broken packet: ${packet}`);
      return;
    }

    if (packet.metadata.message_type == 'session_welcome') {
      this.id = packet.payload.session.id;
      this.emit('online');
    }

    if (packet.metadata.message_type == 'session_reconnect') {
      await this.connection.close();
      this.connect(packet.payload.session.reconnect_url);
    }

    switch (packet.metadata?.subscription_type) {
      case 'stream.online':
        this.emit('live', packet.payload.event);
        break;
    }
  }

  async subscribe(type, version, condition) {
    const headers = {
      "Content-Type": "application/json"
    }
    const body = {
      "type": type,
      "version": version,
      "condition": condition,
      "transport": {
        "method": "websocket",
        "session_id": this.id
      }
    }

    let res = await post('eventsub/subscriptions', headers, body, true);

    if (typeof res == 'string') { this.debug(res); return false; }
    else if (res.status == 200) return true;
    else { this.debug(res); return false; }
  }

  debug(msg) {
    this.emit('debug', msg);
  }
}