const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, {
                text: `*💿 Master, please tell me the song name!*\n_Example:_ .play Enemy Imagine Dragons`,
                quoted: message
            });
        }

        // React with random emoji
        const reactEmojis = ['🎧', '🎶', '🔥', '💿', '✨'];
        const emoji = reactEmojis[Math.floor(Math.random() * reactEmojis.length)];
        await sock.sendMessage(chatId, {
            react: { text: emoji, key: message.key }
        });

        // YouTube search
        const { videos } = await yts(searchQuery);
        if (!videos.length) {
            return await sock.sendMessage(chatId, {
                text: `❌ *No results found for:* _${searchQuery}_`,
                quoted: message
            });
        }

        const video = videos[0];
        const { title, timestamp, views, url } = video;

        // Download audio
        const res = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${url}`);
        const data = res.data;

        if (!data?.status || !data?.result?.downloadUrl) {
            return await sock.sendMessage(chatId, {
                text: `⚠️ *Couldn't fetch audio. Try again later, Master.*`,
                quoted: message
            });
        }

        // Send audio with badass caption
        await sock.sendMessage(chatId, {
            audio: { url: data.result.downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `╭─❖「 *🎵 Track Ready* 」\n` +
                     `│ *🎧 Title:* ${title}\n` +
                     `│ *⏱ Duration:* ${timestamp || "?"}\n` +
                     `│ *👁 Views:* ${views.toLocaleString()}\n` +
                     `│ *🔗 Link:* ${url}\n` +
                     `╰─❖ *Summoned by Mahiru*`
        }, { quoted: message });

    } catch (err) {
        console.error("Play Command Error:", err);
        await sock.sendMessage(chatId, {
            text: `❌ *An error occurred while processing your song, Master.*`,
            quoted: message
        });
    }
}

module.exports = playCommand;
