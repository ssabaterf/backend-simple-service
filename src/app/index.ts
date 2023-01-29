import { appendFile } from 'fs';
import CreateTodoRouter from '../todo/routes/todo.route';
import { TodoService } from '../todo/service/todo.service';
import { ExpressApp } from '../platform/expressFramework';
import { getConfig } from './config';
import consoleLogger from '../middleware/logger';
import { Platform } from './Platform.base';
import { WebsocketApp } from '../platform/websocketFramework';
import { TodoController } from '../todo/controller/todo.controller';

// This is the main entry point of the application.
async function main (){
    //Loading the configuration
    const config = getConfig();
    //Creating the platform instance
    const platformREST = new ExpressApp();
    const platformWS = new WebsocketApp()

    //Creating the service instance for Todo
    const todoService = new TodoService();
    const todoController = new TodoController(todoService);
    const todoEndpoints = CreateTodoRouter(todoController)

    //Registering the endpoints and middlewares in REST API and Websocket
    platformREST.register('/todo', todoEndpoints, [consoleLogger]);
    platformWS.register('/todo', todoEndpoints, [consoleLogger]);

    //Starting the server
    platformWS.listen(config.portWebsocket, () => {
        console.log(`Websocket server started at http://localhost:${config.portWebsocket}`);
    })
    platformREST.listen(config.portRest, () => {
        console.log(`Rest server started at http://localhost:${config.portRest}`);
    })
}
main();