const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "setprefix",
    desc: "Update the bot's command prefix",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, m, mek, { from, reply, text, isOwner }) => {

    // 🛡️ Ensure only the owner can change the system prefix
    if (!isOwner) return reply("*❌ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ*");

    // Check if the user actually typed a new prefix
    if (!text) return reply("*⚠️ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴇғɪx (ᴇ.ɢ .sᴇᴛᴘʀᴇғɪx !)*");

    try {
        // Update the live config prefix
        config.PREFIX = text;

        // Success Reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

        // Styled POPKID MP3 Response 💝
        const caption = `╭┄┄┄⪼*⚙️ Y O U  S E T T I N G S 💝*\n` +
                        `┊*✨ sᴛᴀᴛᴜs:* ᴘʀᴇғɪx ᴜᴘᴅᴀᴛᴇᴅ ʟɪᴠᴇ\n` +
                        `┊*🎯 ɴᴇᴡ ᴘʀᴇғɪx:* [ ${text} ]\n╰┄┄┄⪼\n` +
                        `> *ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs ᴡɪʟʟ ɴᴏᴡ ʀᴇsᴘᴏɴᴅ ᴛᴏ ${text}*`;

        await conn.sendMessage(from, { 
            image: { url: config.ALIVE_IMG || "https://h.uguu.se/HLtauNcE.jpg" }, 
            caption: caption 
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("*❗ sʏsᴛᴇᴍ ᴇʀʀᴏʀ: ᴜɴᴀʙʟᴇ ᴛᴏ ᴍᴏᴅɪғʏ ᴘʀᴇғɪx*");
    }
});
