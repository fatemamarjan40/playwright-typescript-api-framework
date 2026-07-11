export class APIlogger{
    private recentlogs : any[]=[]
    logRequest(method: string, url: string, header: Record<string,string>, body?:any)
    {
        const logEntry = {method, url, header,body}
        this.recentlogs.push({type: 'Request Details', data: logEntry})
    }
    logResponse(StatusCode:number, body?:any)
    {
        const logEntry = {StatusCode, body}
        this.recentlogs.push({type: 'Response Details', data: logEntry})
    }

    getRecentlogs()
    {
        const logs = this.recentlogs.map(log =>{
            return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}`
        }).join('\n\n')
        return logs
    }

}