import { Message } from "discord.js";
import { Utils } from "./utils";
import { SimpleCallback, CommandCallback } from "./callbacks";

export class ActionExecutor {
    
    constructor(
        private discordMessage: Message
    ) { }

    public replySameChannel(text: string) {
        this.discordMessage.channel.send(text);
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

    public do(callback: CommandCallback, minArgs: number, regEx: string, errorMessage: string) {
        var minimumArgs = minArgs || 0;
        var regExPattern = regEx || "";
        let args = this.discordMessage.content.trim().split(" ");

        // Remove command from args
        args.splice(0, 1);

        let rawArgs = args.join(" ");
        let pattern = new RegExp(regExPattern)
        if ((args.length < minimumArgs || !pattern.test(rawArgs)) && errorMessage) {
            this.replySameChannel(errorMessage);
        } else {
            callback(args, rawArgs, this.discordMessage);
        }
    }

}