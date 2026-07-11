import { APIRequestContext } from "@playwright/test"
import { expect } from '@playwright/test';
import { APIlogger } from "./logger";
import { test } from '@playwright/test'


export class RequestHandler {

    private request: APIRequestContext
    private baseUrl?: string | undefined;
    private logger: APIlogger
    private apiPath: string = ' '
    private defaultUrl: string
    private queryParam: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}
    private defaultAuthTokan: string
    private clearAuthflag: boolean = false

    constructor(request: APIRequestContext, apiBaseURL: string, logger: APIlogger, authtoken: string = '') {
        this.request = request
        this.defaultUrl = apiBaseURL
        this.logger = logger
        this.defaultAuthTokan = authtoken
    }

    url(url: string) {
        this.baseUrl = url
        return this

    }
    path(path: string) {
        this.apiPath = path
        return this

    }
    params(params: object) {
        this.queryParam = params
        return this

    }
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this

    }
    body(body: object) {
        this.apiBody = body
        return this

    }

    clearAuth() {
        this.clearAuthflag = true
        return this
    }
    async getRequest(statuscode: number) {

        let responseJson: any

        const url = this.getUrl();
        await test.step(`Get request to: ${url}`, async () => {
            this.logger.logRequest('GET', url, this.getHeaders())
            const response = await this.request.get(url, {
                headers: this.getHeaders()

            })
            this.cleanupfields()
            const actualStatus = await response.status()
            responseJson = await response.json()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statuscode, this.getRequest)

        })

        return responseJson;
    }
    async PostRequest(statuscode: number) {
        let responseJson: any
        const url = this.getUrl();
        await test.step(`post request to: ${url}`, async () => {

            this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody)

            const response = await this.request.post(url, {
                headers: this.getHeaders(),
                data: this.apiBody

            })
            this.cleanupfields()

            const actualStatus = await response.status()
            responseJson = await response.json()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statuscode, this.PostRequest)

        })
        return responseJson;

    }

    async PutRequest(statuscode: number) {

        let responseJson: any
        const url = this.getUrl();
        await test.step(`put request to: ${url}`, async () => {

            this.logger.logRequest('PUT', url, this.getHeaders(), this.apiBody)

            const response = await this.request.put(url, {
                headers: this.getHeaders(),
                data: this.apiBody

            })
            this.cleanupfields()

            const actualStatus = await response.status()
            responseJson = await response.json()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statuscode, this.PutRequest)
        })
        return responseJson;
    }
    async DeletetRequest(statuscode: number) {
        const url = this.getUrl();
        await test.step(`delete request to: ${url}`, async () => {

            this.logger.logRequest('DELETE', url, this.getHeaders())

            const response = await this.request.delete(url, {
                headers: this.getHeaders(),

            })
            this.cleanupfields()

            const actualStatus = await response.status()
            this.logger.logResponse(actualStatus)
            this.statusCodeValidator(actualStatus, statuscode, this.DeletetRequest)

        })
    }
    private getUrl() {
        const base = this.baseUrl || this.defaultUrl;

        const url = new URL(base + this.apiPath);

        for (const [key, value] of Object.entries(this.queryParam)) {
            url.searchParams.append(key, String(value));
        }

        return url.toString();
    }

    private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
        if (actualStatus !== expectStatus) {
            const logs = this.logger.getRecentlogs()
            const error = new Error(`Expected status ${expectStatus} but got Actual status ${actualStatus}  Recent API activity:\n${logs}`)


            throw error

        }
    }

    private getHeaders() {
        if (!this.clearAuthflag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthTokan
        }
        return this.apiHeaders
    }
    private cleanupfields() {

        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParam = {}
        this.clearAuthflag = false
    }

}