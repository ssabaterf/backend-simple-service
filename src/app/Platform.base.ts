//Abstractionc of the platform entrypoint to the application real endpoints
//This define the bridge between the framwerorks like REST API, GraphQL, Websockets, etc
export interface Platform{
    register(path: string, router: AppRoute[], middlewares?:Middleware[]): void;
    listen(port: string, callback: () => void): void;
    createRouterForRoutes(routes: AppRoute[], middlewares?: Middleware[]): any;
    mapperToAppRequest ( req: any, next:any): Request;
    wraperHandler(handler: (params:Request)=>Promise<any>):any;
    wraperMiddleware(middleware: Middleware):any;
}
export type Middleware = (req: Request, next: any) => Promise<void>

export type AppRoute ={
    path:string
    method:string
    handler:(params:Request)=>Promise<Response>
}
export type Request = {
    body: any,
    params: any
    query?: any
    path?: string
    headers?: any
    nextFunction?: any
}
export type Response = {
    status: number,
    body: unknown
}