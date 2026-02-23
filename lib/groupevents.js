const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363404137900781@newsletter',
            newsletterName: ' 𝐘𝐎𝐔 𝐌𝐃 𝐁𝐎𝐓🌟',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText = `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n┆𝙷𝙴𝚈𝚈 @${userName} 👋\n┆𝙳𝙴𝚅 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇\n┆𝚅𝙴𝚁𝚂𝙸𝙾𝙽 𝟷.𝟶.𝟶\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n\n` +
                    `╭┄┄ WELCOME FAN'S\n┆𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝚃𝙾 *${metadata.subject}*.\n` +
                    `┊𝚈𝙾𝚄 𝙰𝚁𝙴 𝙼𝙴𝙼𝙱𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁 ${groupMembersCount} 𝙸𝙽 𝚃𝙷𝙴 𝙶𝚁𝙾𝚄𝙿 this . 🙏\n` +
                    `┆𝚃𝙸𝙼𝙴 𝙹𝙾𝙸𝙽𝙴𝙳 *${timestamp}*\n` +
                    `┆𝚁𝙴𝙰𝙳 𝚃𝙷𝙴 𝙶𝚁𝙾𝚄𝙿 𝙳𝙴𝚂𝙲...\n` +
                    `╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n` +
                    `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ уσυ ᴛᴇᴄʜ 🌟*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const GoodbyeText = `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n┆𝙶𝙾𝙾𝙳𝙱𝚈𝙴 @${userName}. 😔\n┆𝙳𝙴𝚅 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇\n┆𝚅𝙴𝚁𝚂𝙸𝙾𝙽 𝟷.𝟶.𝟶\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n\n` +
                    `╭┄┄ GOODBYE FAN'S\n` +
                    `┆𝚃𝙸𝙼𝙴 𝙻𝙴𝙵𝚃 *${timestamp}*\n` +
                    `┆𝚃𝙷𝙴 𝙶𝚁𝙾𝚄𝙿 𝙽𝙾𝚆 𝙷𝙰𝚂 ${groupMembersCount} 𝙼𝙴𝙼𝙱𝙴𝚁𝚂. 😭\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ уσυ ᴛᴇᴄʜ 🌟`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n┆*𝙰𝙳𝙼𝙸𝙽 𝙴𝚅𝙴𝙽𝚃*\n` +
                          `┆@${demoter} 𝙷𝙰𝚂 𝙳𝙳𝙼𝙾𝚃𝙴𝙳 @${userName} 𝙵𝚁𝙾𝙼 𝙰𝙳𝙼𝙸𝙽. 👀\n` +
                          `┆𝚃𝙸𝙼𝙴 ${timestamp}\n` +
                          `┆𝙶𝚁𝙾𝚄𝙿 ${metadata.subject}\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍\n┆*𝙰𝙳𝙼𝙸𝙽 𝙴𝚅𝙴𝙽𝚃*\n` +
                          `┆@${promoter} 𝙷𝙰𝚂 𝙿𝚁𝙾𝙼𝙾𝚃𝙴𝙳 @${userName} 𝚃𝙾 𝙰𝙳𝙼𝙸𝙽. 🎉\n` +
                          `┆𝚃𝙸𝙼𝙴 ${timestamp}\n` +
                          `┆𝙶𝚁𝙾𝚄𝙿 ${metadata.subject}\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄❍`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
