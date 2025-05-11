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

module.exports = helpCommand;
