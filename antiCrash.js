module.exports = (client) => {
  process.on('unhandledRejection', (r, p) => {
    const data = {
      username: 'Live Bot unhandledRejection',
      content: `\`\`\`\n${r}\n\n${p}\n\`\`\``,
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
      content: `\`\`\`\n${e}\n\n${o}\n\`\`\``,
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
      content: `\`\`\`\n${e}\n\n${o}\n\`\`\``,
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

  process.on('multipleResolves', (t, p, v) => {
    const data = {
      username: 'Live Bot multipleResolves',
      content: `\`\`\`\n${t}\n${p}\n${v}\n\`\`\``,
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