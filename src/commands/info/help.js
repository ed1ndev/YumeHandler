const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [command | all]',
      description: oneLine`
        Displays a list of all current commands, sorted by category. 
        Can be used in conjunction with a command for additional information.
        Will only display commands that you have permission to access unless the \`all\` parameter is given.
      `,
      type: client.types.INFO,
      examples: ['help ping']
    });
  }
  run(message, args) {

    const all = (args[0] === 'all') ? args[0] : '';
    const embed = new MessageEmbed();
    const prefix = message.client.prefix; // Get prefix
    const { INFO, OWNER } = message.client.types;
    const { capitalize } = message.client.utils;
    
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (
      command && 
      (command.type != OWNER || message.client.isOwner(message.member))
    ) {
      
      embed // Build specific command help embed
        .setTitle(`Command Details:`)
        .setDescription(command.description)
        .addField('Command', `\`${command.name}\``)
        .addField('Usage', `\`${prefix}${command.usage}\``, true)
        .addField('Type', `\`${capitalize(command.type)}\``, true)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
      if (command.examples) embed.addField('Examples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));

    } else if (args.length > 0 && !all) {
      return this.sendErrorMessage(message, 0, 'Unable to find command, please check provided command');

    } else {

      // Get commands
      const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
      }

      const emojiMap = {
        [INFO]: `${capitalize(INFO)}`,
        [OWNER]: `${capitalize(OWNER)}`
      };

      message.client.commands.forEach(command => {
        
        if (command.userPermissions && command.userPermissions.every(p => message.member.hasPermission(p)) && !all)
          commands[command.type].push(`\`${command.name}\``);
        else if (!command.userPermissions || all) {
          commands[command.type].push(`\`${command.name}\``);
        }
        
      });

      const total = Object.values(commands).reduce((a, b) => a + b.length, 0) - commands[OWNER].length;
      const size = message.client.commands.size - commands[OWNER].length;

      embed // Build help embed
        .setTitle('📬 Need help? Here are all of my commands:')
        .setDescription(
          `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ping\`.`)
        .setImage(message.client.user.displayAvatarURL({size: 1024}))
        .setFooter(
          (!all && size != total) ? 
            'Only showing available commands.\n' + message.member.displayName : message.member.displayName, 
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
        if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (commands[type][0])
          embed.addField(`**${emojiMap[type]} [${commands[type].length}]**`, commands[type].join(' '));
      }

      if (message.client.config.invite_link !== "none") {
        embed.addField(
          '**Links**', 
          `**[Invite Me](${message.client.config.invite_link})**`
        );
      }
       
    }
    message.channel.send({ embeds: [ embed ] });
    
  }
};