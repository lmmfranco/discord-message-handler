import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("MessageHandler.whenMessageContains test", () => {
    test("whenMessageContains should fire in the middle of message", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContains("foo").do(callback)

        // When
        const message = new MessageMock("loremfooipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("whenMessageContains should fire with different case", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContains("foo").do(callback)

        // When
        const message = new MessageMock("loremFooipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });    
    test("whenMessageContains should not fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContains("foo").do(callback)

        // When
        const message = new MessageMock("lorem ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toBeCalledTimes(0);
    });
});