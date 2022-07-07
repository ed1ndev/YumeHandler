const config = require('./config.json');
const Client = require('./src/Client.js');

global.__basedir = __dirname;

// Client setup
const client = new Client(config, {
  intents: 32767, // Intents calculator -> https://ziad87.net/intents/
} );

// Initialize client
function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  client.loadSlashCommands('./src/slashcommands');
  client.login(client.token);
}

init();

process.on('unhandledRejection', err => client.logger.error(err));