const settings = require('../settings');

async function ownerCommand(sock, chatId, message) {
    try {
        const ownerName = settings.botOwner || "Unknown";
        const rawOwnerNumber = settings.ownerNumber || "+0000000000";
        const ownerNumber = rawOwnerNumber.replace(/[^0-9]/g, '');

        // React with 👑 on the user's command message
        if (message?.key) {
            await sock.sendMessage(chatId, {
                react: {
                    text: '👑',
                    key: message.key
                }
            });
        }

        // Stylish summoning message
        await sock.sendMessage(chatId, {
            text: `☁️ *Summoning The Creator Of Mahiru Bot...*\n⚡ *Establishing spiritual link...*`,
        }, { quoted: message });

        // VCard contact
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:Mahiru Developer;
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}
END:VCARD
        `.trim();

        await sock.sendMessage(chatId, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Elegant info card
        const info = `╔═══⌬『 *👑 Mahiru Bot Owner Info* 』⌬═══╗

┃ 🧑‍💻 *Name:* ${ownerName}
┃ ☎️ *Number:* wa.me/${ownerNumber}
┃ 🛡️ *Role:* Developer & Administrator
┃ ⚙️ *Status:* Active & Watching...
┃ ✨ *Power Level:* ∞
┃
╚════════════════════════════════════╝`;

        await sock.sendMessage(chatId, {
            text: info,
        }, { quoted: message });

    } catch (error) {
        console.error("Owner command error:", error);
        await sock.sendMessage(chatId, {
            text: "❌ *Failed to fetch owner info.* Please try again later.",
        }, { quoted: message });
    }
}

module.exports = ownerCommand;
