import { AppRoute, Middleware, Platform, Request } from "../app/Platform.base";
import { Message, request, server } from "websocket";
import { Server, createServer } from "http";

export class WebsocketApp implements Platform {
    private httpServer: Server;
    private app: server;
    private endpoints: { method: string, middlewares: Middleware[], endpoints: AppRoute }[] = [];
    constructor() {
        this.httpServer = createServer()
        this.app = new server({
            httpServer: this.httpServer,
            autoAcceptConnections: false
        });
        this.app.on('request', (request: request) => {
            if (!this.originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var connection = request.accept('rpc', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            function validUTFMessage(message: any) {
                if (message.type !== 'utf8') {
                    return false;
                }
                try {
                    const body = JSON.parse(message.utf8Data);
                    if (body.method === undefined || body.params === undefined) {
                        return false;
                    }
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            connection.on('message', async (message: Message) => {
                if (validUTFMessage(message)) {
                    const request = this.mapperToAppRequest(message);
                    const endpoint = this.endpoints.filter(x => x.method === request.path?.toUpperCase())
                    if (endpoint.length === 0) {
                        connection.sendUTF(JSON.stringify({ error: "Endpoint not found" }));
                        return;
                    }
                    try {
                        for (let mid = 0; mid < endpoint[0].middlewares.length; mid++) {
                            await endpoint[0].middlewares[mid](request, () => { });
                        }
                        const response = await endpoint[0].endpoints.handler(request)
                        connection.sendUTF(JSON.stringify(response));
                    }
                    catch (error) {
                        const e = error as Error;
                        connection.sendUTF(JSON.stringify(error));
                    }
                }
                else {
                    connection.sendUTF(JSON.stringify({ error: "Invalid message" }));
                }
            });

            connection.on('close', function (reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });
    }
    register(path: string, router: AppRoute[], middlewares?: Middleware[] | undefined): void {
        this.createRouterForRoutes(router, middlewares)
            .map(x => {
                let method = (path + "/" + x.endpoints.method + "/" + x.endpoints.path).replace("//", "/").replace(":", "")
                method = method.startsWith("/") ? method.substring(1) : method;
                return {
                    method: method,
                    middlewares: x.middlewares,
                    endpoints: x.endpoints
                }
            })
            .forEach(route => {
                console.log(`Registered WS: [${route.method.toUpperCase()}]`);
                this.endpoints.push(route);
            })
    }
    listen(port: string, callback: () => void): void {
        this.httpServer.listen(port, callback);
    }
    createRouterForRoutes(routes: AppRoute[], middlewares?: Middleware[] | undefined) {
        return routes.map(route => {
            return ({ method: route.method, middlewares: middlewares || [], endpoints: route });
        });
    }
    mapperToAppRequest = (message: Message): Request => {
        if (message.type !== 'utf8') {
            throw new Error("Message type is not utf8");
        }
        const body = JSON.parse(message.utf8Data);
        return {
            body: body.params,
            params: body.params,
            query: body.params,
            path: body.method,
            headers: {},
            nextFunction: null
        }
    }
    wraperHandler(handler: (params: Request) => Promise<any>) {
        throw new Error("Method not implemented.");
    }
    wraperMiddleware(middleware: Middleware) {
        throw new Error("Method not implemented.");
    }
    private originIsAllowed(origin: any) {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }
}