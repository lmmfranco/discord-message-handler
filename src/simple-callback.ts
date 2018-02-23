import * as Discord from "discord.js";

export interface SimpleCallback {
    (message: Discord.Message): void;
}