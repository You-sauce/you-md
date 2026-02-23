const axios = require('axios')
const { cmd } = require('../command')

global.movieCache = global.movieCache || {}

cmd({
    pattern: "movie",
    alias: ["film"],
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {

    // STEP 1 — SEARCH
    if (args.length > 0) {
        const query = args.join(" ")
        const url = `https://api.srihub.store/movie/sinhalasub?apikey=dew_5H5Dbuh4v7NbkNRmI0Ns2u2ZK240aNnJ9lnYQXR9&q=${encodeURIComponent(query)}`

        const { data } = await axios.get(url)
        if (!data?.result) return reply("❌ No results found")

        // Save movie to cache
        global.movieCache[from] = data.result

        let searchText = `
🔎 *YOU MD SEARCH*

📱 Input   : ${query}
🍒 Results : 1

🎬 *Movies*
01. ${data.result.title}
        `.trim()

        return conn.sendMessage(from, {
            image: { url: data.result.image },
            caption: searchText
        }, { quoted: mek })
    }

    // STEP 2 — USER REPLY (NUMBERS)
    const choice = parseInt(m.text)
    const movie = global.movieCache[from]
    if (!movie || isNaN(choice)) return

    // SHOW MOVIE DOWNLOAD MENU
    if (choice === 1) {
        let menu = `
╭┄┄┄⪼
│ *MOVIE DOWNLOAD*
┊
┊➠ *Title* : ${movie.title}
┊➠ *Site*  : SinhalaSub.lk
┊01 || Send Details
┊02 || Send Images
┊
┊03 || FHD 1080p [ PIXELDRAIN ]
┊04 || HD 720p  [ PIXELDRAIN ]
┊05 || SD 480p  [ PIXELDRAIN ]
┊
┊06 || FHD 1080p [ SINHALASUB ]
┊07 || HD 720p  [ SINHALASUB ]
┊08 || SD 480p  [ SINHALASUB ]
┊
┊09 || FHD 1080p [ MIRROR ]
┊10 || HD 720p  [ MIRROR ]
┊11 || SD 480p  [ MIRROR ]
╰┄┄┄⪼
> *𝙼𝙰𝙳𝙴 𝙸𝙽 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇*💸
        `.trim()

        return conn.sendMessage(from, {
            image: { url: movie.image },
            caption: menu
        }, { quoted: mek })
    }

    // STEP 3 — 🔥 NUMBER 11 (SD 480P VIDEO)
    if (choice === 11) {
        const sd480 =
            movie.downloads?.sinhalasub?.find(v => v.quality.includes("480")) ||
            movie.downloads?.pixeldrain?.find(v => v.quality.includes("480"))

        if (!sd480) return reply("❌ SD 480p not available")

        return conn.sendMessage(from, {
            video: { url: sd480.link },   // ✅ VIDEO, NOT DOCUMENT
            caption: `🎬 *${movie.title}*\n\n📀 Quality : SD 480p\n📦 Size    : ${sd480.size}\n\n> powered by popkid tech`,
            mimetype: 'video/mp4'
        }, { quoted: mek })
    }
})
