import { Request } from "../app/Platform.base";

const consoleLogger = async (req: Request, next: any ) => { 
    console.log(`Request: ${req.path}\n 
    Body: ${JSON.stringify(req.body)}\n 
    Params: ${JSON.stringify(req.params)}\n 
    Query: ${JSON.stringify(req.query)}\n 
    Headers: ${JSON.stringify(req.headers)}`);
    next();
}

export default consoleLogger;