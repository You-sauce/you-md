const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "video",
    desc: "Download video from YouTube by name or link",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply("❌ Give me a video name or YouTube link!\n\nExample:\n.video arike kumnie\n.video https://youtu.be/xxxx");
        }

        const query = args.join(" ");
        const start = Date.now();

        await conn.sendMessage(from, { react: { text: "🎬", key: mek.key } });

        let videoUrl = query;

        // If it's NOT a YouTube link, search first using Yupra search
        if (!query.includes("youtube.com") && !query.includes("youtu.be")) {
            const searchUrl = `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(query)}`;
            const searchRes = await axios.get(searchUrl);

            if (!searchRes.data.status || !searchRes.data.results || searchRes.data.results.length === 0) {
                return reply("❌ No results found for that video.");
            }

            // Take first result
            videoUrl = searchRes.data.results[0].url;
        }

        // Now download using Jawad-Tech YTDL API
        const apiUrl = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result || !data.result.mp4) {
            return reply("❌ Failed to get the video. Try another link or name.");
        }

        const title = data.result.title || "YouTube Video";
        const videoDownloadUrl = data.result.mp4;

        const end = Date.now();
        const speed = end - start;

        await reply(
            `╭┄┄┄┄⪼🎬 *𝚈𝚃 𝚅𝙸𝙳𝙴𝙾𝚂*\n\n` +
            `┊📌 *Title:* ${title}\n` +
            `┊⚡ *Speed:* ${speed} ms\n\n` +
            `┊⬇️ Sending video...\n╰┄┄┄┄⪼`
        );

        await conn.sendMessage(from, {
            video: { url: videoDownloadUrl },
            mimetype: "video/mp4",
            caption: title
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("❌ Error while processing your video request.");
    }
});