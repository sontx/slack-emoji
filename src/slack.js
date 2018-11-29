const request = require("request");
const format = require("string-format");
const dotenv = require("dotenv").config().parsed;

function sendMessageToSlackResponseUrl(responseUrl, JsonMessage) {
  var postOptions = {
    uri: responseUrl,
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    json: JsonMessage
  };
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
    }
  });
}

function sendEmoji(response) {
  const message = {
    response_type: "in_channel",
    text: format(dotenv.MESSAGE_FORMAT, response),
    attachments: [
      {
        fallback: response.emoji,
        image_url: response.emojiLink
      }
    ]
  };
  sendMessageToSlackResponseUrl(response.responseUrl, message);
}

function sendHint(command, matchedEmoji, matchedEmojiLink, responseUrl) {
  const message = {
    text: `Are you looking for ${command} ${matchedEmoji}:`,
    attachments: [
      {
        fallback: matchedEmoji,
        image_url: matchedEmojiLink
      }
    ]
  };
  sendMessageToSlackResponseUrl(responseUrl, message);
}

module.exports = { sendEmoji, sendHint };
