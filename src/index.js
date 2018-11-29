const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config().parsed;
const slack = require("./slack");
const providers = require("./providers");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const APP_VERIFICATION_TOKEN = dotenv.APP_VERIFICATION_TOKEN;
const ENDPOINT = dotenv.ENDPOINT;
const PORT = dotenv.PORT;

function findAlmostMatchedEmoji(provider, emojiName) {
  const foundEmoji = Object.keys(provider).find(
    emoji => emoji.indexOf(emojiName) >= 0 || emojiName.indexOf(emoji) >= 0
  );
  if (foundEmoji) {
    return {
      matchedEmoji: foundEmoji,
      matchedEmojiLink: provider[foundEmoji]
    };
  }
  return {};
}

function getAllAvailableEmojis(provider) {
  return Object.keys(provider) || [];
}

app.post(ENDPOINT, urlencodedParser, (req, res) => {
  const reqBody = req.body;
  if (reqBody.token != APP_VERIFICATION_TOKEN) {
    res.status(403).end("Access forbidden");
  } else {
    res.status(200).end();
    const command = reqBody.command;
    const provider = providers[command];
    let emojiName = reqBody.text;
    const responseUrl = reqBody.response_url;
    if (provider && emojiName) {
      emojiName = emojiName.toLowerCase();
      const emojiLink = provider[emojiName];
      if (emojiLink) {
        const sender = reqBody.user_id;
        slack.sendEmoji({
          emoji: emojiName,
          emojiLink: emojiLink,
          sender: `<@${sender}>`,
          responseUrl: responseUrl
        });
      } else if (emojiName) {
        const { matchedEmoji, matchedEmojiLink } = findAlmostMatchedEmoji(
          provider,
          emojiName
        );
        if (matchedEmoji && matchedEmojiLink) {
          slack.sendHint(command, matchedEmoji, matchedEmojiLink, responseUrl);
        }
      }
    } else if (provider) {
      const allAvailableEmojis = getAllAvailableEmojis(provider);
      slack.sendEmojiList(command, allAvailableEmojis, responseUrl);
    }
  }
});

app.listen(PORT, () =>
  console.log(`slack-emoji is listening on port ${PORT}!`)
);
