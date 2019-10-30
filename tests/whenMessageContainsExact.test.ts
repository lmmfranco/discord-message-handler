import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("MessageHandler.whenMessageContainsExact test", () => {
    test("whenMessageContainsExact should fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsExact("foo").do(callback)

        // When
        const message = new MessageMock("foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("whenMessageContainsExact should not fire with different case", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsExact("foo").do(callback)

        // When
        const message = new MessageMock("Foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
});