import { test as base } from '@playwright/test'
import { RequestHandler } from './request-handler'
import { APIlogger } from './logger'
import{setCustomExpectLogger } from './custom-expect'
import { Config } from '@playwright/test'
import { config } from '../api-test.config'
import { createToken } from '../helper/createToken'

export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export type WorkerFixture = {
    authtoken : string
}
export const test = base.extend<TestOptions, WorkerFixture>({

    authtoken : [async ({}, use) =>{
        const authtoken = await createToken(config.userEmail, config.userPassword)
        await use(authtoken)
    }, {scope: 'worker'}],


    api: async ({ request, authtoken }, use) => {
        const logger = new APIlogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, config.apiURL, logger, authtoken)
        await use(requestHandler)
    },

    config: async({}, use) =>
    {
        await use(config)
    }

}

)