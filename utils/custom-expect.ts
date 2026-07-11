import { expect as baseExpect } from '@playwright/test';
import { APIlogger } from './logger.ts'
import { validateSchema } from './schema-validator.js';

let apiLogger: APIlogger

declare global {
    namespace Playwright {
        interface Matchers<R, T> {
            ShouldEqual(expected: T): R
            ShouldtoBeLessThanOrEqual(expected: T): R
            shouldMatchSchema(received: any, dirName: string, createSchemaFlag?: boolean): Promise<R>
        }
    }
}

export const setCustomExpectLogger = (logger: APIlogger) => {
    apiLogger = logger
}

export const expect = baseExpect.extend({

    async shouldMatchSchema(received: any, dirName: string, fileName: string, createSchemaFlag: boolean = false) {
        let pass: boolean
        let message : string = ''
        try {
            await validateSchema(dirName, fileName, received,createSchemaFlag)
            pass = true;
            message = 'schema validation passed'

        } catch (e: any) {
            pass = false
          const   logs = apiLogger.getRecentlogs()
            message = `${e.message}\n\nRecent API Activity:\n${logs}`

        }
        // const hint = this.isNot ? 'not' : ''
        // const message = this.utils.matcherHint('ShouldEqual', undefined, undefined, { isNot: this.isNot }) +
        //     '\n\n' +
        //     `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
        //     `Received: ${this.utils.printReceived(received)}\n\n` +
        //     `Recent API Activity:\n${logs}`

        return {
            message: () => message,
            pass
        };

    },
    ShouldEqual(received: any, expected: any) {
        let pass: boolean
        let logs: string = ''
        try {
            baseExpect(received).toEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = apiLogger.getRecentlogs()

            }

        } catch (e: any) {
            pass = false
            logs = apiLogger.getRecentlogs()

        }
        const hint = this.isNot ? 'not' : ''
        const message = this.utils.matcherHint('ShouldEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `Recent API Activity:\n${logs}`

        return {
            message: () => message,
            pass
        };

    },
    ShouldtoBeLessThanOrEqual(received: any, expected: any) {
        let pass: boolean
        let logs: string = ''
        try {
            baseExpect(received).toEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = apiLogger.getRecentlogs()

            }

        } catch (e: any) {
            pass = false
            logs = apiLogger.getRecentlogs()

        }
        const hint = this.isNot ? 'not' : ''
        const message = this.utils.matcherHint('ShouldtoBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n\n` +
            `Recent API Activity:\n${logs}`

        return {
            message: () => message,
            pass
        };

    }



})