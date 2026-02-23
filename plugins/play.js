const config = require('../config');
const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'play',
  desc: 'Search & play YouTube audio',
  category: 'downloader',
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    if (!args.length) {
      return reply('❌ *Provide a song name*\n\nExample:\n.play Kau masih kekasihku');
    }

    const query = args.join(' ');
    const api = `https://api.deline.web.id/downloader/ytplay?q=${encodeURIComponent(query)}`;

    await conn.sendMessage(from, {
      react: { text: '🎧', key: mek.key }
    });

    const { data } = await axios.get(api);

    if (!data.status || !data.result) {
      return reply('❌ *Failed to find the song*');
    }

    const res = data.result;

    const caption = `
╭┄┄┄⪼ *Y T B P L A Y* 
┊❍ *Title:* ${res.title}
┊❍ *Quality:* ${res.pick?.quality || '128kbps'}
┊❍ *Size:* ${res.pick?.size || 'Unknown'}
┊❍ *Format:* ${res.pick?.ext || 'mp3'}
╰┄┄┄⪼
> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ${config.BOT_NAME || '𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇'}*
    `.trim();

    await conn.sendMessage(from, {
      audio: { url: res.dlink },
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      caption,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        externalAdReply: {
          title: res.title,
          body: 'YouTube Audio Player',
          thumbnailUrl: res.thumbnail,
          sourceUrl: res.url,
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
