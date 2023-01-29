// express router
import { TodoController } from '../controller/todo.controller';
import { ITodoService } from '../service/todo.service';

const CreateTodoRouter = (todoController: TodoController)=>{
    const router = [
        { path: '/', method: 'create', handler: todoController.create },
        { path: '/', method: 'find', handler: todoController.find },
        { path: '/:id', method: 'find', handler: todoController.findById },
        { path: '/:id', method: 'update', handler: todoController.update },
        { path: '/:id', method: 'remove', handler: todoController.remove },
    ]
    return router;
}

export default CreateTodoRouter;