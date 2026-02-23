const { cmd } = require('../command');

cmd({
    pattern: "ping",
    desc: "Check bot speed",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, reply }) => {
    const start = Date.now();
    await conn.sendMessage(from, { react: { text: "📍", key: mek.key } });
    const end = Date.now();
    
    return await reply(`🚀 *Pong:* ${end - start}ms`);
});
