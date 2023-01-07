# ChatBot

This our submission for SheBuilds Hackathon

## Botbuilder

Here are the instructions to get started with the botbuilder.

```bash
npm install -g npm
npm install -g yo
npm install -g generator-botbuilder
yo botbuilder
? What's the name of your bot? my-chat-bot
? What will your bot do? Demonstrate the core capabilities of the Microsoft Bot Framework
? What programming language do you want to use? JavaScript
? Which template would you like to start with? Echo Bot - https://aka.ms/bot-template-echo
? Looking good.  Shall I go ahead and create your new bot? Yes
```

From there:

```bash
npm start
```

## Start the Emulator and connect your bot

1. Start the Bot Framework Emulator.

2. Select **Open Bot** on the Emulator's **Welcome** tab.

3. Enter your bot's URL, which is your local host and port, with `/api/messages` added to the path. The address is usually: `http://localhost:3978/api/messages`.

     ![open a bot](https://learn.microsoft.com/en-us/azure/bot-service/media/quickstart/emulator-open-bot.png?view=azure-bot-service-4.0)

4. Then select **Connect**.

    Send a message to your bot, and the bot will respond back.
