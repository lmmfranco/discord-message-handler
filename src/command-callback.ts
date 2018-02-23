import * as Discord from "discord.js";

export interface CommandCallback {
    (args: string[], rawArgs: string, message: Discord.Message): void;
}