import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";
import { ChannelMock } from "./__mocks__/channel-mock";
import { UserMock } from "./__mocks__/user-mock";

jest.useFakeTimers();

describe("MessageHandler.onCommand test", () => {
    test("onCommand should fire with arguments", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").do(callback)

        // When
        const message = new MessageMock("!foo bar lol");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledWith(["bar", "lol"], "bar lol", message);
    });
    test("onCommand should fire without arguments", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").do(callback)

        // When
        const message = new MessageMock("!foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledWith([], "", message);
    });
    test("onCommand should fire with alias", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").alias("!f").alias("/f").do(callback)

        // When
        const message1 = new MessageMock("!foo");
        const message2 = new MessageMock("!f");
        const message3 = new MessageMock("/f");
        handler.handleMessage(message1);
        handler.handleMessage(message2);
        handler.handleMessage(message3);

        // Then
        expect(callback).toHaveBeenCalledTimes(3);
    });
    test("onCommand should fire with min args", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").minArgs(1).whenInvalid("To few arguments.").do(callback)

        // When
        const message = new MessageMock("!foo bar");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("onCommand should not fire with min args", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").minArgs(1).whenInvalid({ replyToUser: false, minimumArgs: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("onCommand should warn usage", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").minArgs(1).whenInvalid({ replyToUser: false, minimumArgs: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo");
        handler.handleMessage(message);

        // Then
        expect(message.channel.send).toHaveBeenCalledWith("warning");
    });
    test("onCommand should fire on match success with string pattern", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches("\\d \\d").whenInvalid({ replyToUser: false, regexPattern: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo 2 4");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("onCommand should fire on match success with regex pattern", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches(/\d \d/).whenInvalid({ replyToUser: false, regexPattern: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo 2 4");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("onCommand should not fire on match success with regex pattern but channel not in allowedChannels", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches(/\d \d/).allowedChannels(["123456789"]).whenInvalid({ replyToUser: false, allowedChannels: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo 2 4");
        const channel = new ChannelMock("987654321")
        message.channel = channel
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("onCommand should not fire on match success with regex pattern but channel not in allowedChannels", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches(/\d \d/).allowedChannels(["123456789"]).whenInvalid({ replyToUser: false, allowedChannels: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo 2 4");
        const channel = new ChannelMock("987654321")
        message.channel = channel
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("onCommand should not fire on match fail with string pattern", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches("\\d \\d").whenInvalid({ replyToUser: true, regexPattern: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo a b");
        message.author = new UserMock();
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("onCommand should not fire on match fail with regex pattern", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches(/\d \d/).whenInvalid({ replyToUser: false, regexPattern: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo a b");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("onCommand should warn usage on match fail", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").matches(/\d \d/).whenInvalid({ replyToUser: false, regexPattern: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo a b");
        handler.handleMessage(message);

        // Then
        expect(message.channel.send).toHaveBeenCalledWith("warning");
    });
    test("onCommand should delete invocation", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        const waitTime = 1500
        handler.onCommand("!foo").deleteInvocation(waitTime).do(callback)

        // When
        const message = new MessageMock("!foo");
        handler.handleMessage(message);

        // Then
        expect(message.delete).not.toHaveBeenCalled()
        jest.advanceTimersByTime(waitTime);
        expect(message.delete).toHaveBeenCalled()
    });
    test("onCommand should fire if channel does match allowedChannels ids", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").allowedChannels(["123456789"]).whenInvalid({ replyToUser: false, allowedChannels: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo bar");
        const channel = new ChannelMock();
        channel.id = "123456789";
        message.channel = channel;
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    })
    test("onCommand should not fire if channel does NOT match allowedChannels ids", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.onCommand("!foo").allowedChannels(["123456789"]).whenInvalid({ replyToUser: false, allowedChannels: "warning" }).do(callback)

        // When
        const message = new MessageMock("!foo bar");
        const channel = new ChannelMock();
        channel.id = "987654321";
        message.channel = channel;
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    })
});