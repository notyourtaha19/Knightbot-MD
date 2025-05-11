const fs = require('fs');
const path = require('path');

const OWNER_ID = '923004204338@s.whatsapp.net';
const MODS = ['923354301343@s.whatsapp.net'];
const bannedFilePath = path.resolve(__dirname, '../data/banned.json');

async function banCommand(sock, chatId, message) {
  const senderId = message.key?.participant || message.key?.remoteJid;

  // Authorization Check
  const isAuthorized = senderId === OWNER_ID || MODS.includes(senderId);
  if (!isAuthorized) {
    await sock.sendMessage(chatId, {
      text: '⛔ *Access Denied!*\n\nOnly the bot *Owner* or *Moderators* can ban users.'
    });
    return;
  }

  // Get Target User
  const contextInfo = message.message?.extendedTextMessage?.contextInfo;
  let userToBan = null;

  if (contextInfo?.mentionedJid?.length > 0) {
    userToBan = contextInfo.mentionedJid[0];
  } else if (contextInfo?.participant) {
    userToBan = contextInfo.participant;
  }

  if (!userToBan) {
    await sock.sendMessage(chatId, {
      text: '⚠️ *Usage:* Reply to or mention a user to ban.\n\nExample: `.ban Spamming`'
    });
    return;
  }

  // Extract Reason
  const msgText = message.message?.extendedTextMessage?.text || '';
  const args = msgText.trim().split(' ').slice(1);
  const reason = args.join(' ') || 'No reason provided';

  // Load Ban List
  let bannedList = [];
  if (fs.existsSync(bannedFilePath)) {
    try {
      bannedList = JSON.parse(fs.readFileSync(bannedFilePath));
    } catch (err) {
      console.error('Error reading ban file:', err);
      await sock.sendMessage(chatId, {
        text: '❌ *Error reading ban list.*'
      });
      return;
    }
  }

  // Check if already banned
  if (bannedList.find(entry => entry.user === userToBan)) {
    await sock.sendMessage(chatId, {
      text: `🚫 *User @${userToBan.split('@')[0]} is already banned!*`,
      mentions: [userToBan]
    });
    return;
  }

  // Group Name
  let groupName = 'Private Chat';
  try {
    const meta = await sock.groupMetadata(chatId);
    groupName = meta.subject;
  } catch {}

  // Final Data
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'GMT' });
  const senderTag = `@${senderId.split('@')[0]}`;
  const userTag = `@${userToBan.split('@')[0]}`;

  // Save Ban Entry
  bannedList.push({
    user: userToBan,
    details: {
      bannedBy: senderId,
      group: groupName,
      timestamp,
      reason
    }
  });

  try {
    fs.writeFileSync(bannedFilePath, JSON.stringify(bannedList, null, 2));
  } catch (err) {
    console.error('Error writing ban file:', err);
    await sock.sendMessage(chatId, {
      text: '❗ *Failed to ban user. File error.*'
    });
    return;
  }

  // Send Success Message
  await sock.sendMessage(chatId, {
    text:
      `🟥 *User Banned from Commands!*\n\n` +
      `👤 *User:* ${userTag}\n` +
      `✔️ *Banned by:* ${senderTag}\n` +
      `🏷️ *Group:* ${groupName}\n` +
      `⏰ *Time:* ${timestamp} (GMT)\n` +
      `📮 *Reason:* *${reason}*`,
    mentions: [userToBan, senderId]
  });
}

module.exports = banCommand;
