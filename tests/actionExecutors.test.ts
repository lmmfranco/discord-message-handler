import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("ActionExecutor test", () => {
    test("reply() should fire", () => {
        // Given
        const handler = new MessageHandler();
        handler.onCommand("foo").reply("message")

        // When
        const message = new MessageMock("foo");
        handler.handleMessage(message);

        // Then
        expect(message.channel.send).toHaveBeenCalledWith("message");
    });
    test("replyOne() should fire", () => {
        // Given
        const handler = new MessageHandler();
        handler.onCommand("foo").replyOne(["bar", "lol"])

        // When
        const message = new MessageMock("foo");
        for(let i = 1; i <= 10; i++) {
            handler.handleMessage(message);
        }

        // Then
        expect(message.channel.send.mock.calls).toContainEqual(["bar"]);
        expect(message.channel.send.mock.calls).toContainEqual(["lol"]);
    });
    test("do() should fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn();
        handler.onCommand("foo").do(callback)

        // When
        const message = new MessageMock("foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("then() should fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn();
        handler.onCommand("foo").then(callback)

        // When
        const message = new MessageMock("foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("sometimes() should fire roughly the correct amount of times", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn();
        handler.onCommand("foo").sometimes(50).then(callback)

        // When
        const message = new MessageMock("foo");
        for(let i = 1; i <= 100; i++) {
            handler.handleMessage(message);
        }

        // Then
        expect(callback.mock.calls.length).toBeGreaterThan(40)
        expect(callback.mock.calls.length).toBeLessThan(60)
    });
});