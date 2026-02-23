const { cmd } = require("../command");
const config = require("../config");

const recentCallers = new Set();

// === Anti-Call Event Handler ===
cmd({ on: "body" }, async (client, message, chat, { from: sender }) => {
  try {
    client.ev.on("call", async (callData) => {
      if (!config.ANTI_CALL) return;

      for (const call of callData) {
        if (call.status === 'offer' && !call.isGroup) {
          // Reject incoming call
          await client.rejectCall(call.id, call.from);

          // Notify only once every 10 minutes per caller
          if (!recentCallers.has(call.from)) {
            recentCallers.add(call.from);

            await client.sendMessage(call.from, {
              text: `📞 *ᴀᴜᴛᴏ ʀᴇᴊᴇᴄᴛ ᴀᴄᴛɪᴠᴀᴛᴇᴅ!* ☠️\n\nʏou ᴄᴀɴɴᴏᴛ ᴄᴀʟʟ ᴛʜɪs ɴᴜᴍʙᴇʀ ᴡʜɪʟᴇ ᴀɴᴛɪ-ᴄᴀʟʟ ᴍᴏᴅᴇ ɪs ᴀᴄᴛɪᴠᴇ.\n\n_sᴛᴀʏ ɪɴ ᴛᴇxᴛ ᴍᴏᴅᴇ!_`,
              mentions: [call.from]
            });

            // Clear caller after 10 minutes
            setTimeout(() => recentCallers.delete(call.from), 10 * 60 * 1000);
          }
        }
      }
    });
  } catch (error) {
    console.error("❌ Call rejection error:", error);
    await client.sendMessage(sender, { text: `⚠️ Error: ${error.message}` }, { quoted: chat });
  }
});

// === Anti-Call Command ===
cmd({
  pattern: "anticall",
  alias: ["callblock", "togglecall"],
  desc: "Toggle call blocking feature",
  category: "owner",
  react: "📞",
  filename: __filename,
  fromMe: true
},
async (client, message, m, { isOwner, from, sender, args }) => {
  try {
    if (!isOwner) {
      return client.sendMessage(from, {
        text: "🚫 *ᴏᴡɴᴇʀ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!*",
        mentions: [sender]
      }, { quoted: message });
    }

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "📞", additionalInfo = "";

    switch (action) {
      case 'on':
        if (config.ANTI_CALL) {
          statusText = "📌 ᴀɴᴛɪ-ᴄᴀʟʟ ɪs ᴀʟʀᴇᴀᴅʏ *ᴇɴᴀʙʟᴇᴅ*!";
          reaction = "ℹ️";
        } else {
          config.ANTI_CALL = true;
          statusText = "✅ ᴀɴᴛɪ-ᴄᴀʟʟ ʜᴀs ʙᴇᴇɴ *ᴇɴᴀʙʟᴇᴅ*!";
          reaction = "✅";
          additionalInfo = "ᴄᴀʟʟs ᴡɪʟʟ ɴᴏᴡ ʙᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ʀᴇᴊᴇᴄᴛᴇᴅ 🔇";
        }
        break;

      case 'off':
        if (!config.ANTI_CALL) {
          statusText = "📌 ᴀɴᴛɪ-ᴄᴀʟʟ ɪs ᴀʟʀᴇᴀᴅʏ *ᴅɪsᴀʙʟᴇᴅ*!";
          reaction = "ℹ️";
        } else {
          config.ANTI_CALL = false;
          statusText = "❌ ᴀɴᴛɪ-ᴄᴀʟʟ ʜᴀs ʙᴇᴇɴ *ᴅɪsᴀʙʟᴇᴅ*!";
          reaction = "❌";
          additionalInfo = "ᴄᴀʟʟs ᴄᴀɴ ɴᴏᴡ ᴄᴏᴍᴇ ᴛʜʀᴏᴜɢʜ ☎️";
        }
        break;

      default:
        statusText = `📌 ᴀɴᴛɪ-ᴄᴀʟʟ sᴛᴀᴛᴜs: ${config.ANTI_CALL ? "✅ *ᴇɴᴀʙʟᴇᴅ*" : "❌ *ᴅɪsᴀʙʟᴇᴅ*"}`;
        additionalInfo = config.ANTI_CALL ? "Calls are being blocked 🔒" : "Calls are allowed ☎️";
        break;
    }

    // Send combined image + newsletter style message
    await client.sendMessage(from, {
      image: { url: "https://h.uguu.se/HLtauNcE.jpg" },
      caption: `
${statusText}
${additionalInfo}

*𝙲𝚁𝙴𝙰𝚃 𝙱𝚈 𝚈𝙾𝚄 𝚃𝙴𝙲𝙷𝚇*
      `,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363404137900781@newsletter',
          newsletterName: '𝐘𝐎𝐔 𝐌𝐃 𝐁𝐎𝐓',
          serverMessageId: 143
        }
      }
    }, { quoted: message });

    // React to original command for visual feedback
    await client.sendMessage(from, {
      react: { text: reaction, key: message.key }
    });

  } catch (error) {
    console.error("❌ Anti-call command error:", error);
    await client.sendMessage(from, {
      text: `⚠️ Error: ${error.message}`,
      mentions: [sender]
    }, { quoted: message });
  }
});
