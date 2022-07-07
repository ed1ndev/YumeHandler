# 🤖 YumeHandler
> Discord bot Command-Slash-Event handler

## Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. Node.js v16 or newer

## 🚀 Getting Started

```sh
git clone https://github.com/ed1ndev/YumeHandler.git
cd YumeHandler
npm install
```

## ⚙️ Configuration

Copy or Rename `config.json.example` to `config.json` and fill out the values:

⚠️ **Note: Never commit or share your token or api keys publicly** ⚠️

```json
{
  "token": "DISCORD_BOT_TOKEN",
  "ownerId": [ "BOT_OWNER_USER_ID" ],
  "prefix": "!",
  "invite_link": "none",
  "globalSlashCommands": true,
  "mainGuildId": "YOUR_MAIN_GUILD_ID"
}

```

invite_link -> You can leave it at **none** if you don't want to have an invite link in the help command
globalSlashCommands -> You can leave it to **true** if you want your slash commands to be **global**, otherwise set it to **false** and change the mainGuildId to the id of the server where you want the slash commands to be located

## 🤝 Contributing

1. [Fork the repository](https://github.com/ed1ndev/Cryptero/fork)
2. Clone your fork: `git clone https://github.com/your-username/Cryptero.git`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Stage changes `git add .`
5. Commit your changes: `cz` OR `npm run commit` do not use `git commit`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request