# slack-emoji

Server side for handling emoji [Slack slash command](https://api.slack.com/slash-commands) request.

Type:
```bash
/pepe blood
```
Then:
![](https://github.com/sontx/slack-emoji/blob/master/sample.PNG)

# Usage

To show an emoji
```bash
/your_command emoji_name
```

To show all available emojis of a command
```bash
/your_command
```

# Install

Just clone this project and `npm start`

```bash
git clone https://github.com/sontx/slack-emoji.git
npm istall
npm start
```

# Configuration

## Slack slash command

### Create a slack app

1. Goto [slack page](https://api.slack.com/apps).
2. Login/signup if necessary.
3. Click on **Create New App**.
4. Select your app name and a workspace which you are on.
5. Click on **Create App** -> done.

### Add a Slash command

1. In **Basic Information** section, goto **Building Apps for Slack** -> **Add features and functionality** -> Click on **Slash Commands**.
2. In **Slash Commands** section -> Click on **Create New Command**.
3. There are some fields which need to fill up:
  1. Command: your command in slack, ex: **pepe**
  2. Request url: when the user types your command and presses enter, a request will be sent to your sever (that why we have this repo), ex: http://your_domain:your_port/slack/command/emoji
  3. Short description: describe what is the purpose of this command, ex: Pepe the Frog emoji
  4. Usage Hint: what is the parameters, ex: emoji-name
4. Click on **Save** -> done.

## Server

At this time, we already have a Slack slash command but it does nothing, we have to add some businesses by handling the request in our server.

All server configurations are in `.env` file:

```
APP_VERIFICATION_TOKEN = your_slack_app_verification_token
MESSAGE_FORMAT = response message format, ex: {sender} :{emoji}:
ENDPOINT = which endpoint will handle the request, ex: /slack/command/emoji
PORT= listen port, ex: 2911
```

- APP_VERIFICATION_TOKEN: you can achieve this in **App Credentials** -> **Verification Token**
- MESSAGE_FORMAT: a message above responded emoji image, it can be empty, default is `{sender} :{emoji}:`, there are some available params
  - sender: who sent this command.
  - emoji: emoji name.
  - emojiLink: link to the image which matches this emoji.
- ENDPOINT: should match your **Request url** setting in [Add a Slash command](#add-a-slash-command).
- PORT: should match your **Request url** setting in [Add a Slash command](#add-a-slash-command).

## Emoji

You just take care of `emoji` directory and `providers.js` file.

### Add new emoji bundle

Ex: add a new emoji bundle named `meme`:
1. Add file name `meme.js` in `emoji` directory.
2. Define it in `providers.js` file.

### Add new emoji name

1. Goto emoji bundle which will contain the new emoji name.
2. Add a pair of key and value to this file, ex: `new_emoji: "link to the emoji image"`

# License
[MIT](https://github.com/sontx/slack-emoji/blob/master/LICENSE)
