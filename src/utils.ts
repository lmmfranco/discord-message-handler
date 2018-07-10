export const MessageType = {
    MESSAGE_CONTAINS: 0,
    MESSAGE_CONTAINS_EXACT: 1,
    MESSAGE_CONTAINS_WORD: 2,
    MESSAGE_CONTAINS_ONE: 3,
    MESSAGE_STARTS_WITH: 4,
    MESSAGE_ENDS_WITH: 5,
    COMMAND: 6
};

export const ActionType = {
    REPLY: 0,
    REPLY_SOMETIMES: 1,
    REPLY_ONE: 2,
    THEN: 3,
    DO: 4
};

export class Utils {

    static random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static randomItem(array: any[]) {
        return array[Utils.random(0, array.length - 1)];
    }

    static arrayToLower(array: string[]) {
        return array.map(str => str.toLowerCase());
    }

    static startsWithWord(str: string, search: string) {
        return ((str.length == search.length) && (str == search)) ||
            ((str.length > search.length) && (str.startsWith(search + ' ')))
    }

    static getKeyByValue(obj: any, value: any) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (obj[prop] === value)
                    return prop;
            }
        }
    }
}