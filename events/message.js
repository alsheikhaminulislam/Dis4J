const { Collection, Client, Discord } = require("discord.js");
var list = [];
var resivechannelId = "";
var roleName = "";
var maxMessage = 0;
var everyoneroleId = "";
module.exports = (client) => {
  client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    // Destructure author and channel
    const { member, content, guild, author, channel } = message;

    // if (message.content.indexOf(config.PREFIX) !== 0) return;
    // const args = message.content.slice(config.PREFIX.length).trim().split(/ +/g);
    // const command = args.shift().toLowerCase();
    // const cmd = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));
    // if (!cmd) return;

    // Get the sender's ID (author's ID) AND Get the channel ID 

    const senderId = author.id;
    const channelId = channel.id;
    const server = message.guild;
    // console.log("content:  ",content);
    // console.log("senderId:  ",senderId);
    // console.log("channelId:  ",channelId);
    var splitdata = content.split(" ");

    if (content.includes("-set")) {
      list = [];
      // !set #task-122 6 task-122 @everyone
      if (!splitdata[1]) { console.log("ChannelId not found!"); return; }
      if (!splitdata[2]) { console.log("Max Participants not found"); return; }
      if (!splitdata[3]) { console.log("New Role not found"); return; }
      if (!splitdata[4]) { console.log("Mention Role not found"); return; }
      resivechannelId = splitdata[1].replaceAll("<#", "").replaceAll(">", "");
      console.log("resivechannelId:  ", resivechannelId);
      maxMessage = splitdata[2];
      roleName = splitdata[3];
      everyoneroleId = splitdata[4].replaceAll("<@", "").replaceAll("&", "").replaceAll(">", "");
      message.reply(`woohoo, 
      channelId:${resivechannelId}, 
      Max Participants:${maxMessage}, 
      Default Role:${splitdata[4]}
      Default RoleID:${everyoneroleId}
      `);
      if (roleName != "") {
        try {
          if (!server) return;
          // Create a new role
          const role = await server.roles.create({
            data: {
              name: roleName, // Replace with your desired role name
              color: getRandomColor(), // Replace with your desired color (e.g., 'BLUE', 'RED', 'GREEN')
            },
          });

          message.reply(`Created a new role: ${role.name}`);
        } catch (error) {
          console.error('Error creating role:', error);
          message.reply('An error occurred while creating the role.');
        }
      }
    } else if (content.includes("-lc")) {
      if (senderId == "923215520197656596" || senderId == "922841023242207263" || senderId == "831924905200975922") {
        var targetChannel = message.guild.channels.cache.get(channelId); 
          await targetChannel.updateOverwrite(message.guild.roles.everyone, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: false,
          }); 
          message.channel.send('Lock channel.  senderId:' + senderId);
      } else {
        return;
      }
    } else if (content.includes("-ulc")) {
      if (senderId == "923215520197656596" || senderId == "922841023242207263" || senderId == "831924905200975922") {
        var targetChannel = message.guild.channels.cache.get(channelId); 
          await targetChannel.updateOverwrite(message.guild.roles.everyone, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
          }); 
          message.channel.send('Lock channel.  senderId:' + senderId);
      } else {
        return;
      }
    } else if ((resivechannelId != "" && resivechannelId == channelId) && roleName != "") {
      if (maxMessage != list.length) {
        if (senderId == "923215520197656596" || senderId == "922841023242207263" || senderId == "831924905200975922") return;
        if (isData(senderId)) {
          list.push({ senderId: senderId });
          console.log("senderId:  ", senderId);
          const role = message.guild.roles.cache.find((r) => r.name === roleName);
          if (role) {
            // Add the role to the user
            const member = message.guild.members.cache.get(senderId);
            member.roles.add(role)
              .then(() => {
                // message.reply(`Role Added ${roleName}.`);
              })
              .catch((error) => { message.reply('An error occurred while adding the role.'); });

          } else {
            message.reply('User or role not found.');
          }
        } else {
          message.delete();
          message.reply(`You can't send any message a second time!`);
        }
        if (maxMessage == list.length) {
          permissionDisabled(message, resivechannelId, everyoneroleId);
        }
      } else {
        permissionDisabled(message, resivechannelId, everyoneroleId);
      }
      // console.log("maxMessage",maxMessage);
      // console.log("length",list.length);
    } else if (content.includes("-del")) {
      if (server) {
        const role = server.roles.cache.find((r) => r.id === splitdata[1].replaceAll("<@&", "").replaceAll(">", ""));
        if (role) {
          try {
            await role.delete();
            message.reply(`Role '${role.name}' has been deleted.`);
          } catch (error) {
            message.reply('Error deleting the role:' + error);
          }
        } else {
          message.reply(`Role '${splitdata[1]}' not found.`);
        }
      } else {
        // console.log(`Server with ID '${serverId}' not found.`);
      }
    }
    // console.log(list);

    // cmd.run(client, message, args, senderId, channelId);
  })
  function getRandomColor() {
    // Generate a random HEX color code
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return "BLUE";
  }
  async function permissionDisabled(message, resivechannelId, everyoneroleId) {
    var targetChannel = message.guild.channels.cache.get(resivechannelId);
    var roleId;
    if (everyoneroleId == "@everyone") {
      roleId = message.guild.roles.everyone;
    } else {
      roleId = everyoneroleId;
    }
    if (targetChannel) {
      await targetChannel.updateOverwrite(roleId, {
        // VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
      });
      message.channel.send('Bot message permission disabled in the channel.');
    }
  }
  function isData(senderId) {
    for (let index = 0; index < list.length; index++) {
      if (list[index].senderId == senderId) {
        return false;
      }
    }
    return true;
  }
};