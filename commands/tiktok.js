const { ttdl } = require("ruhend-scraper");
const axios = require("axios");

const processedMessages = new Set();
const emojiPool = ['🌟', '🚀', '🎬', '🎥', '💫', '📥', '⚡'];

async function tiktokCommand(sock, chatId, message) {
  try {
    if (processedMessages.has(message.key.id)) return;
    processedMessages.add(message.key.id);
    setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    if (!text) {
      return await sock.sendMessage(chatId, {
        text: "❌ *Missing TikTok Link!*\n\nPlease provide a valid TikTok video link."
      }, { quoted: message });
    }

    const url = text.split(" ").slice(1).join(" ").trim();
    if (!url) {
      return await sock.sendMessage(chatId, {
        text: "❌ *Invalid TikTok Link!*\n\nPlease provide a valid TikTok video link like:\n🔗 https://vm.tiktok.com/xxxxxx\n🔗 https://www.tiktok.com/@user/video/xxxxxx"
      }, { quoted: message });
    }

    const tiktokPatterns = [
      /https?:\/\/(?:www\.)?tiktok\.com\//,
      /https?:\/\/(?:vm\.)?tiktok\.com\//,
      /https?:\/\/(?:vt\.)?tiktok\.com\//,
      /https?:\/\/(?:www\.)?tiktok\.com\/@/,
      /https?:\/\/(?:www\.)?tiktok\.com\/t\//
    ];
    const isValidUrl = tiktokPatterns.some(pattern => pattern.test(url));
    if (!isValidUrl) {
      return await sock.sendMessage(chatId, {
        text: "❌ *Invalid TikTok Link!*\n\nPlease provide a valid TikTok video link like:\n🔗 https://vm.tiktok.com/xxxxxx\n🔗 https://www.tiktok.com/@user/video/xxxxxx"
      }, { quoted: message });
    }

    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    await sock.sendMessage(chatId, {
      react: { text: randomEmoji, key: message.key }
    });

    await sock.sendMessage(chatId, { text: "🔍 *Analyzing the TikTok link...*" }, { quoted: message });
    await sock.sendMessage(chatId, { text: "📥 *Downloading video...*" }, { quoted: message });

    let downloadData = await ttdl(url);

    // Try fallback API if ruhend fails
    if (!downloadData?.data?.length) {
      const apiResponse = await axios.get(`https://api.dreaded.site/api/tiktok?url=${encodeURIComponent(url)}`);
      const videoUrl = apiResponse?.data?.tiktok?.video;
      if (videoUrl) {
        return await sock.sendMessage(chatId, {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          caption: "⬇️ *DOWNLOADED BY 𝗠𝗔𝗛𝗜𝗥𝗨 𝗕𝗢𝗧*\n👑 *OWNER: T A H A*"
        }, { quoted: message });
      }
    }

    if (!downloadData?.data?.length) {
      return await sock.sendMessage(chatId, {
        text: "⚠️ *No media found at the provided TikTok link.*\nPlease try again with a different one."
      }, { quoted: message });
    }

    // Send up to 3 media files
    for (let i = 0; i < Math.min(3, downloadData.data.length); i++) {
      const media = downloadData.data[i];
      const mediaUrl = media.url;
      const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || media.type === "video";

      const caption = "⬇️ *DOWNLOADED BY 𝗠𝗔𝗛𝗜𝗥𝗨 𝗕𝗢𝗧*\n👑 *OWNER: T A H A*";
      if (isVideo) {
        await sock.sendMessage(chatId, {
          video: { url: mediaUrl },
          mimetype: "video/mp4",
          caption
        }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, {
          image: { url: mediaUrl },
          caption
        }, { quoted: message });
      }
    }

  } catch (error) {
    console.error("Error in TikTok command:", error);
    await sock.sendMessage(chatId, {
      text: "❌ *An error occurred while processing the TikTok link.*\nPlease try again later."
    }, { quoted: message });
  }
}

module.exports = tiktokCommand;
