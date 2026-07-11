import { RequestHandler } from "../utils/request-handler"
import { APIlogger } from "../utils/logger"
import { request } from "@playwright/test"
import { config } from "../api-test.config"

export async function createToken(email: string, password: string) {
    const context = await request.newContext()
     const logger = new APIlogger()
   const api = new RequestHandler(context, config.apiURL, logger)

   try{
    const tokenResponse = await api
    .path('/users/login')
    .body({
      "user": {
        "email": email,
        "password": password,
      }
    })
    .PostRequest(200)

    return "Token " + tokenResponse.user.token;
   }
   catch(error){
    throw error
   }finally{
    await context.dispose()
   }
}