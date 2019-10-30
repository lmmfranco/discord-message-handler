import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("MessageHandler.whenMessageEndsWith test", () => {
    test("whenMessageEndsWith should fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageEndsWith("foo").do(callback)

        // When
        const message = new MessageMock("lorem ipsum foo");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("whenMessageEndsWith should not fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageEndsWith("foo").do(callback)

        // When
        const message = new MessageMock("lorem foo ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toBeCalledTimes(0);
    });
});