const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

cmd({
    pattern: "video2",
    desc: "Download YouTube video (mp4)",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, m, mek, { from, reply }) => {

    const start = Date.now();
    const query = m.text.split(" ").slice(1).join(" ").trim();

    if (!query) return reply("❗ Please send a video name or YouTube link.");

    // ⏳ Loading reaction
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    try {

        let videoUrl;
        let title;
        let thumbnail;
        let duration;
        let views;

        // =========================
        // 🔎 SEARCH IF NOT LINK
        // =========================
        if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i.test(query)) {

            const search = await yts(query);

            if (!search.videos || !search.videos.length)
                return reply("❌ No results found.");

            const v = search.videos[0];

            videoUrl = v.url;
            title = v.title;
            thumbnail = v.thumbnail;
            duration = v.timestamp;
            views = v.views?.toLocaleString() || "Unknown";

        } else {
            videoUrl = query;
        }

        // =========================
        // 🎥 FETCH MP4 FROM API
        // =========================

        const api = `https://api.giftedtech.co.ke/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;

        const res = await fetch(api);
        const json = await res.json();

        if (!json.success || !json.result?.download_url)
            return reply("❌ Failed to fetch video from server.");

        const downloadUrl = json.result.download_url;

        title = title || json.result.title || "Unknown Title";
        thumbnail = thumbnail || json.result.thumbnail;
        duration = duration || json.result.duration || "Unknown";

        // Clean filename (safe for WhatsApp)
        const safeFileName = title.replace(/[^\w\s]/gi, '').slice(0, 60);

        // =========================
        // 📥 DOWNLOAD VIDEO BUFFER
        // =========================

        const videoBuffer = await fetch(downloadUrl).then(r => r.buffer());

        const speed = Date.now() - start;

        // =========================
        // 🎨 MODERN PREVIEW CARD
        // =========================

        const caption = `
╭┄┄『 🎬  𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* 』
┊ 🎞️ *Title:* ${title}
┊ ⏱️ *Duration:* ${duration}
┊ 👁️ *Views:* ${views || "Unknown"}
┊ ⚡ *Speed:* ${speed}ms
╰┄┈┈┄┄⪼

> 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ${config.BOT_NAME || "𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇"} 🇰🇪
        `.trim();

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption
        });

        // =========================
        // ▶️ SEND PLAYABLE VIDEO
        // =========================

        await conn.sendMessage(from, {
            video: videoBuffer,
            mimetype: "video/mp4",
            fileName: `${safeFileName}.mp4`,
            caption: `▶️ ${title}`
        });

        // ✅ Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("❗ Error while downloading video.");
    }
});
