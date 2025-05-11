const fs = require('fs');
const path = require('path');

const OWNER_ID = '923004204338@s.whatsapp.net';
const MODS = ['923354301343@s.whatsapp.net'];
const bannedFilePath = path.resolve(__dirname, '../data/banned.json');

async function unbanCommand(sock, chatId, message) {
  const senderId = message.key?.participant || message.key?.remoteJid;

  // Permission check
  const isAuthorized = senderId === OWNER_ID || MODS.includes(senderId);
  if (!isAuthorized) {
    await sock.sendMessage(chatId, {
      text: '⛔ *Access Denied!*\n\nOnly the bot *Owner* or *Moderators* can unban users.'
    });
    return;
  }

  // Get user to unban
  const contextInfo = message.message?.extendedTextMessage?.contextInfo;
  let userToUnban = null;

  if (contextInfo?.mentionedJid?.length > 0) {
    userToUnban = contextInfo.mentionedJid[0];
  } else if (contextInfo?.participant) {
    userToUnban = contextInfo.participant;
  }

  if (!userToUnban) {
    await sock.sendMessage(chatId, {
      text: '⚠️ *Usage:* Mention a user or reply to their message to unban them.'
    });
    return;
  }

  // Load banned list
  let bannedList = [];
  if (fs.existsSync(bannedFilePath)) {
    try {
      bannedList = JSON.parse(fs.readFileSync(bannedFilePath));
    } catch (err) {
      console.error('Error reading banned.json:', err);
      await sock.sendMessage(chatId, {
        text: '❌ *Error reading ban list. Check server files.*'
      });
      return;
    }
  }

  // Check if user is in ban list
  const index = bannedList.findIndex(entry => entry.user === userToUnban);
  if (index === -1) {
    await sock.sendMessage(chatId, {
      text: `ℹ️ *User:* @${userToUnban.split('@')[0]}\n\nNot currently banned.`,
      mentions: [userToUnban]
    });
    return;
  }

  // Remove from list
  bannedList.splice(index, 1);
  try {
    fs.writeFileSync(bannedFilePath, JSON.stringify(bannedList, null, 2));
  } catch (err) {
    console.error('Error writing to banned.json:', err);
    await sock.sendMessage(chatId, {
      text: '❗ *Failed to unban user. File error.*'
    });
    return;
  }

  // Group name
  let groupName = 'Private Chat';
  try {
    const metadata = await sock.groupMetadata(chatId);
    groupName = metadata.subject;
  } catch {}

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'GMT' });

  // Confirmation
  await sock.sendMessage(chatId, {
    text:
      `🟩 *User Unbanned from Commands!*\n\n` +
      `👤 *User:* @${userToUnban.split('@')[0]}\n` +
      `✔️ *Unbanned by:* @${senderId.split('@')[0]}\n` +
      `🏷️ *Group:* ${groupName}\n` +
      `⏰ *Time:* ${timestamp} (GMT)\n\n` +
      `✅ *Access to commands has been restored.*`,
    mentions: [userToUnban, senderId]
  });
}

module.exports = unbanCommand;
