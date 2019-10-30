import { MessageHandler } from "../src";
import { MessageMock } from "./__mocks__/message-mock";

describe("MessageHandler.whenMessageContainsWord test", () => {
    test("whenMessageContainsWord should fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsWord("foo").do(callback)

        // When
        const message = new MessageMock("lorem foo ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });
    test("whenMessageContainsWord should fire with different case", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsWord("foo").do(callback)

        // When
        const message = new MessageMock("lorem Foo ipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toHaveBeenCalled();
    });    
    test("whenMessageContainsWord should not fire", () => {
        // Given
        const handler = new MessageHandler();
        const callback = jest.fn()
        handler.whenMessageContainsWord("foo").do(callback)

        // When
        const message = new MessageMock("loremfooipsum");
        handler.handleMessage(message);

        // Then
        expect(callback).toBeCalledTimes(0);
    });
});