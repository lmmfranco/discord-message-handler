import { Message } from "discord.js";

export const MessageMock = jest.fn().mockImplementation(function(content) : Message {
    return <any> {
        content: content,
        channel: {
            send: jest.fn()
        },
        delete: jest.fn()
    }
});