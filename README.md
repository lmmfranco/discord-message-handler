## About
**discord-message-handler** is a module written to simplify message and command handling for [discord.js](https://github.com/hydrabolt/discord.js) bots and applications.

## Installation
Simply navigate to your project's folder and type `npm install discord-message-handler --save` on the command line.

## Usage
To start using the module you must require it into you script like this:
```js
const MessageHandler = require('discord-message-handler');
```
Define rules for the message handler (shown below) then parse messages in the as they arrive:
```js
client.on('message', message => {
    MessageHandler.handleMessage(message);
});
```

### Simple message handlers
```js
MessageHandler.whenMessageContainsWord("shrug").reply("¯\\_(ツ)_/¯");
MessageHandler.whenMessageContains("lol").replySometimes("kek", 50);
MessageHandler.whenMessageContainsExact("dota").replyOne(["volvo pls", "rip doto"]);
MessageHandler.whenMessageContainsOne(["br", "brazil"]).reply("huehue");
MessageHandler.whenMessageStartsWith("help").then(message => doSomething(message));
```

### Command handler
```js
MessageHandler.onCommand("/doit").do((args, rawArgs, message) => {
    message.channel.sendMessage(`Doing something for ${message.author}...`)
});
```

### Commands with alias
```js
MessageHandler.onCommand("/information").alias("/info").alias("/i").do((args) => {
    doSomething(args[0]);
});
```

### Commands with usage info
```js
MessageHandler 
    .onCommand("/info")
    .minArgs(2)
    .whenInvalid("Invalid command. Usage: /info <a> <b>")
    .do((args) => {
        doSomething(args[0]);
        doSomethingElse(args[1]);
    });
```

### Case sensitivity
In case you want message filters to be case sensitive you just need to call this function once:
```js
MessageHandler.setCaseSensitive(true);
```
By default all message filters are case insensitive. (false)

### Logging
To enable logging call `MessageHandler.enableLogging()` and pass a function to handle logs.
```js
MessageHandler.enableLogging((filterType, filter, message) => {
    console.log(`${new Date().toISOString()} ${filterType}: ${filter} - "${message.content}"`);
});
```

## Contributing
Feel free to send a pull request or open an issue if something is not working as intended or you belive could be better.
