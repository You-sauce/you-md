// 🌟 AntiDelete Command — Fixed & Clean (Functionality Preserved)

const config = require('../config');
const { cmd } = require('../command');
const {
    getAnti,
    setAnti,
    initializeAntiDeleteSettings
} = require('../data/antidel');

// 🔁 Ensure AntiDelete settings exist on startup
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ["antidel", "ad"],
    desc: "Configure AntiDelete settings",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, isCreator }) => {

    // 🔐 Owner-only access
    if (!isCreator) {
        return reply("🚫 *This command is only available to the bot owner.*");
    }

    try {
        const args = (q || "").toLowerCase().trim().split(/\s+/);

        // Examples:
        // .antidelete on
        // .antidelete off gc
        // .antidelete set gc
        // .antidelete set all
        // .antidelete status

        const main = args[0];      // on / off / set / status
        const sub = args[1];       // gc / dm / all

        switch (main) {

            // ✅ Enable AntiDelete everywhere
            case "on":
                await setAnti("gc", true);
                await setAnti("dm", true);
                return reply("✅ *AntiDelete has been ENABLED for all chats.*");

            // ❌ Disable AntiDelete options
            case "off":
                if (sub === "gc") {
                    await setAnti("gc", false);
                    return reply("❌ *AntiDelete for Group Chats has been DISABLED.*");
                } else if (sub === "dm") {
                    await setAnti("dm", false);
                    return reply("❌ *AntiDelete for Direct Messages has been DISABLED.*");
                } else if (sub === "all") {
                    await setAnti("gc", false);
                    await setAnti("dm", false);
                    return reply("❌ *AntiDelete has been DISABLED for all chats.*");
                } else {
                    return reply("⚠️ Use: `.antidelete off gc`, `.antidelete off dm`, or `.antidelete off all`");
                }

            // 🔁 Toggle or set
            case "set":
                if (sub === "gc") {
                    const gcStatus = await getAnti("gc");
                    await setAnti("gc", !gcStatus);
                    return reply(`🔄 *Group Chat AntiDelete* is now *${!gcStatus ? "Enabled ✅" : "Disabled ❌"}*`);
                } 
                else if (sub === "dm") {
                    const dmStatus = await getAnti("dm");
                    await setAnti("dm", !dmStatus);
                    return reply(`🔄 *DM AntiDelete* is now *${!dmStatus ? "Enabled ✅" : "Disabled ❌"}*`);
                } 
                else if (sub === "all") {
                    await setAnti("gc", true);
                    await setAnti("dm", true);
                    return reply("✅ *AntiDelete has been ENABLED for ALL chats.*");
                } 
                else {
                    return reply("⚠️ Use: `.antidelete set gc`, `.antidelete set dm`, or `.antidelete set all`");
                }

            // 📊 Show current status
            case "status": {
                const currentDmStatus = await getAnti("dm");
                const currentGcStatus = await getAnti("gc");

                return reply(
                    "📊 *AntiDelete Status*\n\n" +
                    `• *Direct Messages:* ${currentDmStatus ? "Enabled ✅" : "Disabled ❌"}\n` +
                    `• *Group Chats:* ${currentGcStatus ? "Enabled ✅" : "Disabled ❌"}`
                );
            }

            // 📖 Help Menu
            default:
                return reply(
                    "📖 *AntiDelete Command Guide*\n\n" +
                    "• `.antidelete on` — Enable AntiDelete for all chats\n" +
                    "• `.antidelete off gc` — Disable AntiDelete in Group Chats\n" +
                    "• `.antidelete off dm` — Disable AntiDelete in Direct Messages\n" +
                    "• `.antidelete off all` — Disable AntiDelete everywhere\n" +
                    "• `.antidelete set gc` — Toggle AntiDelete for Group Chats\n" +
                    "• `.antidelete set dm` — Toggle AntiDelete for Direct Messages\n" +
                    "• `.antidelete set all` — Enable AntiDelete everywhere\n" +
                    "• `.antidelete status` — View current AntiDelete status"
                );
        }

    } catch (error) {
        console.error("❌ AntiDelete Command Error:", error);
        return reply("⚠️ *An error occurred while processing your request.*");
    }
});
