import { TextChannel } from "discord.js";

export const ChannelMock = jest.fn().mockImplementation(function(id): TextChannel {
    return <any> {
        id: id,
        send: jest.fn()
    }
});