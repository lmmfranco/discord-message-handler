import * as Discord from "discord.js";
import { SimpleCallback } from "./simple-callback";
import { CommandCallback } from "./command-callback";
import { ActionType } from "./utils";

export class HandlerConfig {
    public type: number;
    public query: string;
    public action: number;
    public actionArgs: any[];
    public callback: SimpleCallback | CommandCallback;
    public aliases: string;
    public minArgs: number;
    public errorMessage: string;
}

export class HandlerBuilder {
    public handler;

    constructor() {
        this.handler = new HandlerConfig();
    }

    type(type: number) {
        this.handler.type = type;
        return this;
    }

    query(query: string | string[]) {
        this.handler.query = query;
        return this;
    }

    reply(text: string) {
        this.handler.action = ActionType.REPLY;
        this.handler.actionArgs = [text];
    }

    replySometimes(text: string, chance: number) {
        this.handler.action = ActionType.REPLY_SOMETIMES;
        this.handler.actionArgs = [text, chance];
    }

    replyOne(array: string[]) {
        this.handler.action = ActionType.REPLY_ONE;
        this.handler.actionArgs = array;
    }

    then(callback: SimpleCallback) {
        this.handler.action = ActionType.THEN;
        this.handler.callback = callback;
    }

    do(callback: CommandCallback) {
        this.handler.action = ActionType.DO;
        this.handler.callback = callback;
    }

    minArgs(count: number) {
        this.handler.minArgs = count;
        return this;
    }

    alias(alt: string) {
        if (this.handler.aliases) {
            this.handler.aliases.push(alt);
        } else {
            this.handler.aliases = [alt];
        }
        return this;
    }

    whenInvalid(message: string) {
        this.handler.errorMessage = message;
        return this;
    }
}