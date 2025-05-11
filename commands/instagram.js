const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId) {
    const helpMessage = `> ≻───── ⋆✩⋆ ─────≺
  𝗠𝗔𝗛𝗜𝗥𝗨 𝗕𝗢𝗧 v2.0.0
👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥: T A H A
> ≻───── ⋆✩⋆ ─────≺

✨ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗠𝗮𝗵𝗶𝗿𝘂 𝗕𝗼𝘁 — 𝘆𝗼𝘂𝗿 𝗮𝗻𝗶𝗺𝗲-𝘁𝗵𝗲𝗺𝗲𝗱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁!

≻───『 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』───≺  
> .help  .ping  .alive  .tts  .owner  .joke  .quote  .fact  .weather  .news  .attp  .lyrics  .8ball  .groupinfo  .staff  .vv  .pair  .trt  .ss <

≻───『 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』───≺  
> .ban  .unban  .promote  .demote  .kick  .mute  .unmute  .warn  .warnings  .tag  .tagall  .chatbot  .delete  .del  .antilink  .antibadword  .resetlink  .clear <

≻───『 𝗢𝗪𝗡𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』───≺  
> .mode  .autostatus  .clearsession  .antidelete  .cleartmp  .setpp  .autoreact <

≻───『 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 & 𝗜𝗠𝗔𝗚𝗘 』───≺  
> .sticker  .simage  .blur  .meme  .emojimix  .take  .tgsticker <

≻───『 𝗙𝗨𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』───≺  
> .flirt  .compliment  .insult  .character  .wasted  .simp  .stupid  .ship  .truth  .dare <

≻───『 𝗚𝗔𝗠𝗘𝗦 』───≺  
> .tictactoe  .hangman  .guess  .trivia  .answer <

≻───『 𝗔𝗜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』───≺  
> .gpt  .gemini <

≻───『 𝗧𝗘𝗫𝗧𝗠𝗔𝗞𝗘𝗥 』───≺  
> .metallic  .ice  .snow  .impressive  .matrix  .light  .neon  .devil  .purple  .thunder  .leaves  .1917  .arena  .hacker  .sand  .blackpink  .glitch  .fire <

≻───『 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 』───≺  
> .play  .song  .instagram  .facebook  .tiktok <

≻───『 𝗚𝗜𝗧𝗛𝗨𝗕 & 𝗦𝗖𝗥𝗜𝗣𝗧 』───≺  
> .git  .github  .sc  .script  .repo <

≻───『 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 & 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 』───≺  
💬 *Need help or suggestions?*  
Contact the bot owner directly for assistance:  
👑 *BOT OWNER: 𓆩ᴛ ᴀ ʜ ᴀ𓆪*

✨ Thank you for using *Mahiru Bot*!  
⚡ Stay awesome, stay automated! ⚡`;

    try {
        const videoPath = path.join(__dirname, '../assets/Mahiru_help.mp4');

        if (fs.existsSync(videoPath)) {
            const videoBuffer = fs.readFileSync(videoPath);
            await sock.sendMessage(chatId, {
                video: videoBuffer,
                caption: helpMessage,
                gifPlayback: true,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            });
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;const { igdl } = require("ruhend-scraper");

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

// Emoji pool for random reaction
const emojiPool = ['🔄', '🎬', '📥', '⬇️', '📲', '⚡', '💻', '📽️', '💾', '🖥️', '🎥', '💡', '🌟', '🚀', '📡'];

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide an Instagram link for the video." 
            }, { quoted: message });
        }

        // Instagram link validation
        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];
        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));
        if (!isValidUrl) {
            return await sock.sendMessage(chatId, {
                text: "That is not a valid Instagram link. Please provide a valid post, reel, or video link."
            }, { quoted: message });
        }

        // React with a random emoji
        const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        await sock.sendMessage(chatId, {
            react: { text: randomEmoji, key: message.key }
        });

        // Step 1: Analyzing...
        await sock.sendMessage(chatId, {
            text: "🔍 *Analyzing the video link...*",
        }, { quoted: message });

        // Step 2: Downloading...
        await sock.sendMessage(chatId, {
            text: "📥 *Downloading video...*",
        }, { quoted: message });

        const downloadData = await igdl(text);
        if (!downloadData?.data?.length) {
            return await sock.sendMessage(chatId, {
                text: "No media found at the provided link."
            }, { quoted: message });
        }

        // Step 3: Sending...
        await sock.sendMessage(chatId, {
            text: "📦 *Sending video or file...*",
        }, { quoted: message });

        for (let i = 0; i < Math.min(20, downloadData.data.length); i++) {
            const media = downloadData.data[i];
            const mediaUrl = media.url;

            // Try to get a caption
            let caption = media.caption || media.title || media.desc || media.description || "";

            // Append custom footer
            const finalCaption = `${caption ? caption + "\n\n" : ""}⬇️ *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃 𝐁𝐘 𝗠𝗔𝗛𝗜𝗥𝗨 𝗕𝗢𝗧*\n👑 *𝗢𝗪𝗡𝗘𝗥: 𝗧 𝗔 𝗛 𝗔*`;

            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) ||
                            media.type === 'video' ||
                            text.includes('/reel/') ||
                            text.includes('/tv/');

            if (isVideo) {
                await sock.sendMessage(chatId, {
                    video: { url: mediaUrl },
                    mimetype: "video/mp4",
                    caption: finalCaption
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    image: { url: mediaUrl },
                    caption: finalCaption
                }, { quoted: message });
            }

            // Optional: log media for debug
            // console.log(JSON.stringify(media, null, 2));
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        await sock.sendMessage(chatId, {
            text: "An error occurred while processing the request."
        }, { quoted: message });
    }
}

module.exports = instagramCommand;
