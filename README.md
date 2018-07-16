<p>
    <a href="https://www.npmjs.com/package/discord-message-handler"><img src="https://img.shields.io/npm/v/discord-message-handler.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-message-handler"><img src="https://img.shields.io/npm/dt/discord-message-handler.svg?maxAge=3600" alt="NPM downloads" /></a>
</p>

## About
**discord-message-handler** is a module written to simplify message and command handling for [discord.js](https://github.com/hydrabolt/discord.js) bots and applications.

## Installation
Simply navigate to your project's folder and type `npm install discord-message-handler --save` on the command line.

## Usage
To start using the module you must require it into you script like this (changed in 2.0)

Old style require:
```js
const MessageHandler = require('discord-message-handler').MessageHandler;
const handler = new MessageHandler();
```

ES2015:
```js
const { MessageHandler } = require('discord-message-handler');
const handler = new MessageHandler();
```

Typescript:
```ts
import { MessageHandler } from 'discord-message-handler';
const handler = new MessageHandler();
```


Define rules for the message handler (shown later in the next sections) then parse messages in the as they arrive:
```js
client.on('message', message => {
    handler.handleMessage(message);
});
```

### Simple message handlers
```js
handler.whenMessageContainsWord("shrug").reply("¯\\_(ツ)_/¯");
handler.whenMessageContains("lol").sometimes(33).reply("kek"); // 33% chance
handler.whenMessageContainsExact("dota").replyOne(["volvo pls", "rip doto"]);
handler.whenMessageContainsOne(["br", "brazil"]).reply("huehue");
handler.whenMessageStartsWith("help").then(message => doSomething(message));
```

### Command handler
```js
handler.onCommand("/doit").do((args, rawArgs, message) => {
    message.channel.sendMessage(`Doing something for ${message.author}...`)
});
```

### Commands with alias
```js
handler.onCommand("/information").alias("/info").alias("/i").do((args) => {
    doSomething(args[0]);
});
```

### Commands with usage info
```js
handler 
    .onCommand("/info")
    .minArgs(2)
    .whenInvalid("Invalid command. Usage: /info <a> <b>")
    .do((args) => {
        doSomething(args[0]);
        doSomethingElse(args[1]);
    });
```

### Command invocation deletion
You can automatically delete the message that triggered a command using the `deleteInvocation` method. The time argument is optional, and if absent the message will be deleted imediatelly.
```js
// User's message will be deleted after 1500ms
handler.onCommand("/afk").deleteInvocation(1500).then((message) => {
    message.channel.send(`${message.author} is now AFK.`);
});
```

### Example handling messages across multiple files

Consider you have the following structure:
```
├── commands
│   ├── greetings.js
│   └── helper.js
└── index.js
```

greetings.js:
```js
module.exports.setup = function(handler) {
    handler.onCommand("/help").reply("<some helpful message>");
    handler.onCommand("/ping").reply("<actually calculate ping>");
}
```

helper.js:
```js
const { MessageHandler } = require('discord-message-handler');

module.exports.setup = function(handler) {
    /* [Optional] You can recreate the handler using the parent context so your IDE will properly give out suggestions for the handler */
    const myhandler = new MessageHandler(handler);
    myhandler.whenMessageContainsWord("hey").reply("yo!");
    myhandler.whenMessageContainsWord("hi").reply("oh hi there :)");
}
```

index.js:
```js
const { MessageHandler } = require('discord-message-handler');
const greetingsCommands = require('./commands/greetings');
const helperCommands = require('./commands/helper')

const handler = new MessageHandler();
greetingsCommands.setup(handler);
helperCommands.setup(handler);

// (...) code continues
```

### Case sensitivity
In case you want message filters to be case sensitive you just need to call this function once:
```js
handler.setCaseSensitive(true);
```
By default all message filters are case insensitive. (false)

### Logging
To enable logging call `handler.enableLogging()` and pass a function to handle logs.
```js
handler.enableLogging((filterType, filter, message) => {
    console.log(`${new Date().toISOString()} ${filterType}: ${filter} - "${message.content}"`);
});
```

## Contributing
Feel free to send a pull request or open an issue if something is not working as intended or you belive could be better.
