import { User } from "discord.js";

export const UserMock = jest.fn().mockImplementation(function(): User {
    return <any> {
        send: jest.fn()
    }
});