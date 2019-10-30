import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("MessageHandler.whenMessageContainsOne test", () => {
    test("whenMessageContainsOne should fire with array", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsOne(["foo", "bar"]).do(callback)

        // When
        const message1 = new MessageMock("lorem ipsum foo");
        const message2 = new MessageMock("lorem ipsum bar");
        handler.handleMessage(message1);
        handler.handleMessage(message2);

        // Then
        expect(callback).toHaveBeenCalledTimes(2);
    });
    test("whenMessageContainsOne should not fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsOne(["foo", "bar"]).do(callback)

        // When
        const message = new MessageMock("lorem ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalledTimes(0);
    });
});