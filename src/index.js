const MessageType = {
    MESSAGE_CONTAINS: 0,
    MESSAGE_CONTAINS_EXACT: 1,
    MESSAGE_CONTAINS_WORD: 2,
    MESSAGE_CONTAINS_ONE: 3,
    MESSAGE_STARTS_WITH: 4,
    MESSAGE_ENDS_WITH: 5,
    COMMAND: 6
};

const ActionType = {
    REPLY: 0,
    REPLY_SOMETIMES: 1,
    REPLY_ONE: 2,
    THEN: 3,
    DO: 4
};

class Utils {

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static randomItem(array) {
        return array[Utils.random(0, array.length - 1)];
    }

    static arrayToLower(array) {
        return array.map(str => str.toLowerCase());
    }

    static startsWithWord(str, search) {
        return ((str.length == search.length) && (str == search)) ||
            ((str.length > search.length) && (str.startsWith(search + ' ')))
    }

    static getKeyByValue(obj, value) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (obj[prop] === value)
                    return prop;
            }
        }
    }
}

class HandlerBuilder {
    constructor() {
        this.handler = {};
    }

    type(_type) {
        this.handler.type = _type;
        return this;
    }

    query(_query) {
        this.handler.query = _query;
        return this;
    }

    reply(_text) {
        this.handler.action = ActionType.REPLY;
        this.handler.actionArgs = [_text];
    }

    replySometimes(_text, _chance) {
        this.handler.action = ActionType.REPLY_SOMETIMES;
        this.handler.actionArgs = [_text, _chance];
    }

    replyOne(array) {
        this.handler.action = ActionType.REPLY_ONE;
        this.handler.actionArgs = array;
    }

    then(_callback) {
        this.handler.action = ActionType.THEN;
        this.handler.callback = _callback;
    }

    do(_callback) {
        this.handler.action = ActionType.DO;
        this.handler.callback = _callback;
    }

    minArgs(count) {
        this.handler.minArgs = count;
        return this;
    }

    alias(alt) {
        if (this.handler.aliases) {
            this.handler.aliases.push(alt);
        } else {
            this.handler.aliases = [alt];
        }
        return this;
    }

    whenInvalid(message) {
        this.handler.errorMessage = message;
        return this;
    }
}

class ActionExecutor {
    constructor(_discordMessage) {
        this.discordMessage = _discordMessage;
    }

    replySameChannel(text) {
        this.discordMessage.channel.sendMessage(text);
    }

    reply(args) {
        this.replySameChannel(args[0]);
    }

    replySometimes(args) {
        if (Utils.random(1, 100) <= args[1]) {
            this.replySameChannel(args[0]);
        }
    }

    replyOne(args) {
        this.replySameChannel(Utils.randomItem(args));
    }

    then(callback) {
        callback(this.discordMessage);
    }

    do(callback, minArgs, errorMessage) {
        var minimumArgs = minArgs || 0;
        let args = this.discordMessage.content.trim().split(" ");

        // Remove command from args
        args.splice(0, 1);

        let rawArgs = args.join(" ");

        if (args.length < minimumArgs && errorMessage) {
            this.replySameChannel(errorMessage);
        } else {
            callback(args, rawArgs, this.discordMessage);
        }
    }

}

class MessageHandler {

    constructor() {
        this.handlers = [];
        this.caseSensitive = false;
        this.logFn = null;
    }

    log(messageType, filter, message) {
        let msgType = Utils.getKeyByValue(MessageType, messageType);

        if (this.logFn && typeof this.logFn == "function") {
            this.logFn(msgType, filter, message);
        }
    }

    setCaseSensitive(isCaseSensitive) {
        this.caseSensitive = isCaseSensitive;
    }

    enableLogging(logFn) {
        this.logFn = logFn;
    }

    whenMessageContains(text) {
        let builder = new HandlerBuilder().type(MessageType.MESSAGE_CONTAINS).query(text);
        this.handlers.push(builder);
        return builder;
    }

    whenMessageContainsExact(text) {
        let builder = new HandlerBuilder().type(MessageType.MESSAGE_CONTAINS_EXACT).query(text);
        this.handlers.push(builder);
        return builder;
    }

    whenMessageContainsWord(text) {
        let builder = new HandlerBuilder().type(MessageType.MESSAGE_CONTAINS_WORD).query(text);
        this.handlers.push(builder);
        return builder;
    }

    whenMessageContainsOne(array) {
        let builder = new HandlerBuilder().type(MessageType.MESSAGE_CONTAINS_ONE).query(array);
        this.handlers.push(builder);
        return builder;
    }

    whenMessageStartsWith(text) {
        let builder = new HandlerBuilder().type(MessageType.MESSAGE_STARTS_WITH).query(text);
        this.handlers.push(builder);
        return builder;
    }


    whenMessageEndsWith(text) {
        let builder = new HandlerBuilder().type(MessageType.MESSAGE_ENDS_WITH).query(text);
        this.handlers.push(builder);
        return builder;
    }

    onCommand(text) {
        let builder = new HandlerBuilder().type(MessageType.COMMAND).query(text);
        this.handlers.push(builder);
        return builder;
    }

    handleMessage(discordMessage) {
        let messageRaw = discordMessage.content;

        this.handlers
            .map(builder => builder.handler)
            .filter(handler => {
                let message;
                let query;

                if (this.caseSensitive) {
                    message = discordMessage.content;
                    query = handler.query;
                } else {
                    message = discordMessage.content.toLowerCase();

                    if (Array.isArray(handler.query)) {
                        query = Utils.arrayToLower(handler.query);
                    } else {
                        query = handler.query.toLowerCase()
                    }
                }

                switch (handler.type) {
                    case MessageType.MESSAGE_CONTAINS:
                        return message.includes(query);
                    case MessageType.MESSAGE_CONTAINS_EXACT:
                        return messageRaw.includes(handler.query);
                    case MessageType.MESSAGE_CONTAINS_WORD:
                        return message.split(" ").indexOf(query) >= 0;
                    case MessageType.MESSAGE_CONTAINS_ONE:
                        return query.filter(queryParam => message.split(" ").indexOf(queryParam) >= 0).length > 0;
                    case MessageType.MESSAGE_STARTS_WITH:
                    case MessageType.COMMAND:
                        if (handler.aliases) {
                            handler.aliases.push(query);
                            let check = handler.aliases.map(q => Utils.startsWithWord(message, q));
                            return check.reduce((a, b) => a || b);
                        } else {
                            return Utils.startsWithWord(message, query);
                        }
                    case MessageType.MESSAGE_ENDS_WITH:
                        return message.endsWith(query);
                    default:
                        return false;
                }
            })
            .forEach(handler => {
                this.log(handler.type, handler.query, discordMessage);
                let executor = new ActionExecutor(discordMessage);

                switch (handler.action) {
                    case ActionType.REPLY:
                        executor.reply(handler.actionArgs);
                        break;
                    case ActionType.REPLY_SOMETIMES:
                        executor.replySometimes(handler.actionArgs);
                        break;
                    case ActionType.REPLY_ONE:
                        executor.replyOne(handler.actionArgs);
                        break;
                    case ActionType.THEN:
                        executor.then(handler.callback);
                        break;
                    case ActionType.DO:
                        executor.do(handler.callback, handler.minArgs, handler.errorMessage);
                        break;
                    default:
                        break;
                }
            });

    }
}

module.exports = new MessageHandler();
