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

    public replyUser(text: string) {
        this.discordMessage.author.send(text)
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

    public do(callback: CommandCallback, minArgs: number, regEx: string | RegExp, allowedChannelIds: string[], errorMessage: ErrorMessage | string) {
        var minimumArgs = minArgs || 0;
        var regExPattern = regEx || "";
        let args = this.discordMessage.content.trim().split(" ");
        var allowedChannels = allowedChannelIds || null;
        // Remove command from args
        args.splice(0, 1);

        let rawArgs = args.join(" ");
        let pattern = new RegExp(regExPattern);

        if (((allowedChannels && allowedChannels.indexOf(this.discordMessage.channel.id) == -1) || args.length < minimumArgs || !pattern.test(rawArgs)) && errorMessage) {
            if (typeof (errorMessage) != "string") {
                if (allowedChannels && allowedChannels.indexOf(this.discordMessage.channel.id) == -1) {
                    !errorMessage.replyToUser ? this.replySameChannel(errorMessage.allowedChannels!) : this.replyUser(errorMessage.allowedChannels!);
                }
                else if (args.length < minimumArgs) {
                    !errorMessage.replyToUser ? this.replySameChannel(errorMessage.minimumArgs!) : this.replyUser(errorMessage.minimumArgs!);
                }
                else if (!pattern.test(rawArgs)) {
                    !errorMessage.replyToUser ? this.replySameChannel(errorMessage.regexPattern!) : this.replyUser(errorMessage.regexPattern!);
                }
            } else {
                this.replySameChannel(errorMessage as string);
            }
        } else {
            callback(args, rawArgs, this.discordMessage);
        }
    }

}

export class ErrorMessage {
    replyToUser: boolean;
    minimumArgs?: string;
    regexPattern?: string;
    allowedChannels?: string;
}