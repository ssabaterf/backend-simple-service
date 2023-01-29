// express router
import { TodoController } from '../controller/todo.controller';
import { ITodoService } from '../service/todo.service';

const CreateTodoRouter = (todoService: ITodoService)=>{
    const todoController = new TodoController(todoService);
    const router = [
        { path: '/', method: 'post', handler: todoController.postTodo },
        { path: '/', method: 'get', handler: todoController.getTodos },
        { path: '/:id', method: 'get', handler: todoController.getTodoById },
        { path: '/:id', method: 'put', handler: todoController.putTodoById },
        { path: '/:id', method: 'delete', handler: todoController.deleteTodoById },
    ]
    return router;
}

export default CreateTodoRouter;