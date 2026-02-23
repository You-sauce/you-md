const config = require('../config');
const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'fb2',
  desc: 'Download Facebook videos',
  category: 'downloader',
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    if (!args[0]) {
      return reply('❌ *Provide a Facebook video link*');
    }

    const fbUrl = args[0];
    const api = `https://apis-starlights-team.koyeb.app/starlight/facebook?url=${encodeURIComponent(fbUrl)}`;

    await conn.sendMessage(from, {
      react: { text: '⏳', key: mek.key }
    });

    const { data } = await axios.get(api);

    if (!data || !data.url) {
      return reply('❌ *Failed to fetch video from Facebook*');
    }

    const caption = `
╭┄┄┄⪼ *FACEBOOK DOWNLOADER* 
┊❍ *Title:* ${data.title || 'Facebook Video'}
┊❍ *Author:* ${data.creator || 'Unknown'}
┊❍ *Quality:* HD
┊❍ *Source:* Facebook
╰┄┄┄⪼

> *𝙼𝙰𝙳𝙴 𝙸𝙽 𝙱𝚈 ${config.BOT_NAME || '𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇'}*
    `.trim();

    await conn.sendMessage(from, {
      video: { url: data.url },
      caption,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        externalAdReply: {
          title: data.title || 'Facebook Video',
          body: 'Tap to watch or download',
          thumbnailUrl: data.thumbnail || undefined,
          sourceUrl: fbUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek });

    await conn.sendMessage(from, {
      react: { text: '✅', key: mek.key }
    });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
