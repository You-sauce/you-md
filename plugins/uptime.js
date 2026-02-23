const { cmd } = require('../command');

cmd({
    pattern: "uptime",
    alias: ["runtime", "status"],
    desc: "Check how long the bot has been running.",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, reply }) => {
    try {
        // Calculate uptime
        const uptimeSeconds = process.uptime();
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        const uptimeString = `🕒 *ᴜᴘᴛɪᴍᴇ:* ${hours}ʜ ${minutes}ᴍ ${seconds}s`;

        // Send with a simple reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        
        return await reply(uptimeString);

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
