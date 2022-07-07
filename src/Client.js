const Discord = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const AsciiTable = require('ascii-table');

class Client extends Discord.Client {

  constructor(config, options = {}) {
    
    super(options);

    this.logger = require('./utils/logger.js');

    this.types = {
      INFO: 'info',
      OWNER: 'owner'
    };

    this.commands = new Discord.Collection();

    this.slashCommands = new Discord.Collection();

    this.arrayOfSlashCommands = [];

    this.aliases = new Discord.Collection();

    this.config = config;

    this.token = config.token;

    this.prefix = config.prefix;

    this.ownerId = config.ownerId;

    this.utils = require('./utils/utils.js');

    this.logger.info('Initializing...');

  }

  loadEvents(path) {
    readdir(path, (err, files) => {
      if (err) this.logger.error(err);
      files = files.filter(f => f.split('.').pop() === 'js');
      if (files.length === 0) return this.logger.warn('No events found');
      this.logger.info(`${files.length} event(s) found...`);
      files.forEach(f => {
        const eventName = f.substring(0, f.indexOf('.'));
        const event = require(resolve(__basedir, join(path, f)));
        super.on(eventName, event.bind(null, this));
        delete require.cache[require.resolve(resolve(__basedir, join(path, f)))];
        this.logger.info(`Loading event: ${eventName}`);
      });
    });
    return this;
  }

  loadCommands(path) {
    this.logger.info('Loading commands...');
    let table = new AsciiTable('Commands');
    table.setHeading('File', 'Aliases', 'Type', 'Status');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      commands.forEach(f => {
        const Command = require(resolve(__basedir, join(path, dir, f)));
        const command = new Command(this); // Instantiate the specific command
        if (command.name && !command.disabled) {
          // Map command
          this.commands.set(command.name, command);
          // Map command aliases
          let aliases = '';
          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.aliases.set(alias, command);
            });
            aliases = command.aliases.join(', ');
          }
          table.addRow(f, aliases, command.type, 'pass');
        } else {
          this.logger.warn(`${f} failed to load`);
          table.addRow(f, '', '', 'fail');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  loadSlashCommands(path) {
    this.logger.info('Loading slash commands...');
    let table = new AsciiTable('SlashCommands');
    table.setHeading('File', 'Type');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const slashCommands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      slashCommands.forEach(value => {
        const file = require(`${__basedir}${path.substring(1)}/${dir}/${value}`);
        if (!file?.name) return;
        this.slashCommands.set(file.name, file);
        table.addRow(file.name, 'Chat Input');
        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        this.arrayOfSlashCommands.push(file);
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  isOwner(user) {
    if (this.ownerId.includes(user.id)) return true;
    else return false;
  }
}

module.exports = Client;