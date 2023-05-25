module.exports = (client) => {
  process.on('unhandledRejection', (r, p) => {
    const data = {
      username: 'Live Bot unhandledRejection',
      content: `\`\`\`\nRejection: ${r}\nPromise: ${p}\n\`\`\``,
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

  process.on('uncaughtException', (e, o) => {
    const data = {
      username: 'Live Bot uncaughtException',
      content: `\`\`\`\nError: ${e}\nOrigin: ${o}\n\`\`\``,
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

  process.on('uncaughtExceptionMonitor', (e, o) => {
    const data = {
      username: 'Live Bot uncaughtExceptionMonitor',
      content: `\`\`\`\nError: ${e}\nOrigin: ${o}\n\`\`\``,
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
}