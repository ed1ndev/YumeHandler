const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: ['pre'],
      usage: 'prefix',
      description: 'Fetches BOT\'s current prefix.',
      type: client.types.INFO
    });
  }
  run(message) {
    const prefix = message.client.prefix; // Get prefix
    const embed = new MessageEmbed()
      .setTitle(`${message.client.user.username}'s Prefix`)
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Example', `\`${prefix}ping\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [ embed ] });
  }
};
