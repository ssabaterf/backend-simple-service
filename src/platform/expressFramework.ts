import express from 'express';
import { AppRoute, Platform, Request, Middleware } from '../app/Platform.base';

//This is the implementation of the Platform interface for ExpressJS
export class ExpressApp implements Platform{
    private app: express.Express;
    constructor() {
        this.app = express();
    }
    //This method register the endpoints and middlewares in the REST API
    public register(path: string, router: AppRoute[], middlewares?: Middleware[]) {
        this.app.use(path, this.createRouterForRoutes(router,middlewares));
    }
    //This method start the REST API
    public listen(port: string, callback: () => void) {
        this.app.listen(port, callback);
    }
    //This method create the router for the endpoints and the wrapper for the middlewares
    public createRouterForRoutes(routes: AppRoute[], middlewares: Middleware[]= []){
        const router = express.Router();
        routes.forEach(route => {
            console.log(`Registered REST: [${this.convertFromActionToMethod(route.method.toLowerCase())}]\t${route.path}`);
            const middlewareEx = middlewares.map(middleware => this.wraperMiddleware(middleware));
            switch (route.method) {
                case 'find':
                    router.get(route.path, ...middlewareEx, this.wraperHandler(route.handler));
                    break;
                case 'create':
                    router.post(route.path, ...middlewareEx, this.wraperHandler(route.handler));
                    break;
                case 'update':
                    router.put(route.path, ...middlewareEx, this.wraperHandler(route.handler));
                    break;
                case 'remove':
                    router.delete(route.path, ...middlewareEx, this.wraperHandler(route.handler));
                    break;
            }
        })
        return router;
    }
    //This method map the request from the framework to the request of the application
    public mapperToAppRequest (req: express.Request, next: express.NextFunction): Request  {
        return {
            body: req.body,
            params: req.params,
            query: req.query,
            path: req.path,
            headers: req.headers,
            nextFunction: next
        }
    }
    //This method wrap the handler of the application to the handler of the framework
    public wraperHandler(handler: (params:Request)=>Promise<any>){
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const request = this.mapperToAppRequest(req, next);
            const response = await handler(request);
            res.status(response.status).send(response.body);
        }
    }
    //This method wrap the middleware of the application to the middleware of the framework
    wraperMiddleware(middleware: Middleware) {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const request = this.mapperToAppRequest(req, next);
            try {
                await middleware(request, next);
            } catch (error) {
                const errorResponse = error as Response
                res.status(errorResponse.status).send(errorResponse.body);
            }
        }
    }
    private convertFromActionToMethod(action: string): string {
        switch (action) {
            case 'find':
                return 'GET';
            case 'create':
                return 'POST';
            case 'update':
                return 'PUT';
            case 'remove':
                return 'DELETE';
            default:
                return 'GET';
        }
    }
}
