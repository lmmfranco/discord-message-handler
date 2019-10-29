import { SimpleCallback, CommandCallback } from "./callbacks";
import { ActionType } from "./utils";

export class HandlerConfig {
    public type: number;
    public query: string | string[];
    public action: number;
    public actionArgs: any[];
    public callback: SimpleCallback | CommandCallback;
    public aliases: string[];
    public minArgs: number;
    public matches: string | RegExp;
    public errorMessage: string;
    public chance: number;
    public deleteTimer: number;
}

export class HandlerBuilder {
    public handler: HandlerConfig;

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

    /**
     * @deprecated Use `sometimes(chance)` instead.
     */
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

    matches(regex: string | RegExp) {
        this.handler.matches = regex
        return this;
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

    sometimes(chance: number) {
        this.handler.chance = chance;
        return this;
    }

    /**
     * Delete the message that triggered this command
     * @param time Time in milliseconds
     */
    deleteInvocation(time?: number) {
        this.handler.deleteTimer = time || 0;
        return this;
    }
}