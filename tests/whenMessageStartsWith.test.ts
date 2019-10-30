import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("MessageHandler.whenMessageStartsWith test", () => {
    test("whenMessageStartsWith should fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageStartsWith("foo").do(callback)

        // When
        const message = new MessageMock("foo lorem ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("whenMessageStartsWith should not fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageStartsWith("foo").do(callback)

        // When
        const message = new MessageMock("lorem foo ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toBeCalledTimes(0);
    });
});