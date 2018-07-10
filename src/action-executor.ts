import { Message } from "discord.js";
import { Utils } from "./utils";
import { SimpleCallback, CommandCallback } from "./callbacks";

export class ActionExecutor {
    
    constructor(
        private discordMessage: Message
    ) { }

    public replySameChannel(text: string) {
        this.discordMessage.channel.sendMessage(text);
    }

    public reply(args: string[]) {
        this.replySameChannel(args[0]);
    }

    public replySometimes(args: any[]) {
        if (Utils.random(1, 100) <= args[1]) {
            this.replySameChannel(args[0]);
        }
    }

    public replyOne(args: string[]) {
        this.replySameChannel(Utils.randomItem(args));
    }

    public then(callback: SimpleCallback) {
        callback(this.discordMessage);
    }

    public do(callback: CommandCallback, minArgs: number, errorMessage: string) {
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