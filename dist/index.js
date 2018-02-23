/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = {
    MESSAGE_CONTAINS: 0,
    MESSAGE_CONTAINS_EXACT: 1,
    MESSAGE_CONTAINS_WORD: 2,
    MESSAGE_CONTAINS_ONE: 3,
    MESSAGE_STARTS_WITH: 4,
    MESSAGE_ENDS_WITH: 5,
    COMMAND: 6
};
exports.ActionType = {
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
            ((str.length > search.length) && (str.startsWith(search + ' ')));
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
exports.Utils = Utils;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const message_handler_1 = __webpack_require__(2);
module.exports = message_handler_1.MessageHandler;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const handler_builder_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(0);
const action_executor_1 = __webpack_require__(4);
class MessageHandler {
    constructor() {
        this.handlers = [];
        this.caseSensitive = false;
        this.logFn = null;
    }
    log(messageType, filter, message) {
        let msgType = utils_1.Utils.getKeyByValue(utils_1.MessageType, messageType);
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
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.MESSAGE_CONTAINS).query(text);
        this.handlers.push(builder);
        return builder;
    }
    whenMessageContainsExact(text) {
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.MESSAGE_CONTAINS_EXACT).query(text);
        this.handlers.push(builder);
        return builder;
    }
    whenMessageContainsWord(text) {
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.MESSAGE_CONTAINS_WORD).query(text);
        this.handlers.push(builder);
        return builder;
    }
    whenMessageContainsOne(array) {
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.MESSAGE_CONTAINS_ONE).query(array);
        this.handlers.push(builder);
        return builder;
    }
    whenMessageStartsWith(text) {
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.MESSAGE_STARTS_WITH).query(text);
        this.handlers.push(builder);
        return builder;
    }
    whenMessageEndsWith(text) {
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.MESSAGE_ENDS_WITH).query(text);
        this.handlers.push(builder);
        return builder;
    }
    onCommand(text) {
        let builder = new handler_builder_1.HandlerBuilder().type(utils_1.MessageType.COMMAND).query(text);
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
            }
            else {
                message = discordMessage.content.toLowerCase();
                if (Array.isArray(handler.query)) {
                    query = utils_1.Utils.arrayToLower(handler.query);
                }
                else {
                    query = handler.query.toLowerCase();
                }
            }
            switch (handler.type) {
                case utils_1.MessageType.MESSAGE_CONTAINS:
                    return message.includes(query);
                case utils_1.MessageType.MESSAGE_CONTAINS_EXACT:
                    return messageRaw.includes(handler.query);
                case utils_1.MessageType.MESSAGE_CONTAINS_WORD:
                    return message.split(" ").indexOf(query) >= 0;
                case utils_1.MessageType.MESSAGE_CONTAINS_ONE:
                    return query.filter(queryParam => message.split(" ").indexOf(queryParam) >= 0).length > 0;
                case utils_1.MessageType.MESSAGE_STARTS_WITH:
                case utils_1.MessageType.COMMAND:
                    if (handler.aliases) {
                        handler.aliases.push(query);
                        let check = handler.aliases.map(q => utils_1.Utils.startsWithWord(message, q));
                        return check.reduce((a, b) => a || b);
                    }
                    else {
                        return utils_1.Utils.startsWithWord(message, query);
                    }
                case utils_1.MessageType.MESSAGE_ENDS_WITH:
                    return message.endsWith(query);
                default:
                    return false;
            }
        })
            .forEach((handler) => {
            this.log(handler.type, handler.query, discordMessage);
            let executor = new action_executor_1.ActionExecutor(discordMessage);
            switch (handler.action) {
                case utils_1.ActionType.REPLY:
                    executor.reply(handler.actionArgs);
                    break;
                case utils_1.ActionType.REPLY_SOMETIMES:
                    executor.replySometimes(handler.actionArgs);
                    break;
                case utils_1.ActionType.REPLY_ONE:
                    executor.replyOne(handler.actionArgs);
                    break;
                case utils_1.ActionType.THEN:
                    executor.then(handler.callback);
                    break;
                case utils_1.ActionType.DO:
                    executor.do(handler.callback, handler.minArgs, handler.errorMessage);
                    break;
                default:
                    break;
            }
        });
    }
}
exports.MessageHandler = MessageHandler;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(0);
class HandlerConfig {
}
exports.HandlerConfig = HandlerConfig;
class HandlerBuilder {
    constructor() {
        this.handler = new HandlerConfig();
    }
    type(type) {
        this.handler.type = type;
        return this;
    }
    query(query) {
        this.handler.query = query;
        return this;
    }
    reply(text) {
        this.handler.action = utils_1.ActionType.REPLY;
        this.handler.actionArgs = [text];
    }
    replySometimes(text, chance) {
        this.handler.action = utils_1.ActionType.REPLY_SOMETIMES;
        this.handler.actionArgs = [text, chance];
    }
    replyOne(array) {
        this.handler.action = utils_1.ActionType.REPLY_ONE;
        this.handler.actionArgs = array;
    }
    then(callback) {
        this.handler.action = utils_1.ActionType.THEN;
        this.handler.callback = callback;
    }
    do(callback) {
        this.handler.action = utils_1.ActionType.DO;
        this.handler.callback = callback;
    }
    minArgs(count) {
        this.handler.minArgs = count;
        return this;
    }
    alias(alt) {
        if (this.handler.aliases) {
            this.handler.aliases.push(alt);
        }
        else {
            this.handler.aliases = [alt];
        }
        return this;
    }
    whenInvalid(message) {
        this.handler.errorMessage = message;
        return this;
    }
}
exports.HandlerBuilder = HandlerBuilder;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(0);
class ActionExecutor {
    constructor(discordMessage) {
        this.discordMessage = discordMessage;
    }
    replySameChannel(text) {
        this.discordMessage.channel.sendMessage(text);
    }
    reply(args) {
        this.replySameChannel(args[0]);
    }
    replySometimes(args) {
        if (utils_1.Utils.random(1, 100) <= args[1]) {
            this.replySameChannel(args[0]);
        }
    }
    replyOne(args) {
        this.replySameChannel(utils_1.Utils.randomItem(args));
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
        }
        else {
            callback(args, rawArgs, this.discordMessage);
        }
    }
}
exports.ActionExecutor = ActionExecutor;


/***/ })
/******/ ]);