module.exports = async (client) => {
  
  if (client.config.globalSlashCommands) {
    // Register global
    await client.application.commands.set(client.arrayOfSlashCommands);
  } else {
    await client.guilds.cache
      .get("988734114461003786")
      .commands.set(arrayOfSlashCommands);
  } 

  const activities = [
    { name: 'my friends', type: 'WATCHING' }, 
    { name: 'DEVS', type: 'WATCHING' }
  ];

  // Update presence
  client.user.setPresence({ status: 'online', activity: activities[0] });

  let activity = 1;

  // Update activity every 30 seconds
  setInterval(() => {
    activities[2] = { name: `${client.guilds.cache.size} servers`, type: 'WATCHING' }; // Update server count
    activities[3] = { name: `${client.users.cache.size} users`, type: 'WATCHING' }; // Update user count
    if (activity > 3) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 30000);

  client.logger.info('BOT is now online');
  client.logger.info(`${client.user.username} is running on ${client.guilds.cache.size} server(s)`);
};
