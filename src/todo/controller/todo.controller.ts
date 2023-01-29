import { format } from 'path';
import { PostTodo, PutTodo } from '../dto/todo.dto';
import { ITodoService } from '../service/todo.service';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../model/todo.model';
import { Request, Response } from '../../app/Platform.base';

export class TodoController {
    constructor(private todoService: ITodoService) { }

    async postTodo(request: Request): Promise<Response> {
        const todo: PostTodo = request.body as PostTodo;
        const { title, description, owner } = todo;
        const newTodo = await this.todoService.addTodo({ id: uuidv4(), title, description, owner, state: "todo" });
        return TodoRequest.CreatedRequest(newTodo);
    }

    async getTodos(request: Request): Promise<Response> {
        const todos = await this.todoService.listTodos();
        return TodoRequest.SuccessRequest(todos);
    }

    async getTodoById(request: Request): Promise<Response> {
        const id = request.params['id'];
        const todo = await this.todoService.findTodoById(id);
        if (!todo) {
            return TodoRequest.NotFound('Todo not found');
        }
        return TodoRequest.SuccessRequest(todo);
    }

    async putTodoById(request: Request): Promise<Response> {
        const id = request.params['id'];
        const todo: PutTodo = request.body as PutTodo;
        const { title, description, owner, state } = todo;

        const currentTodo = await this.todoService.findTodoById(id);
        if (!currentTodo) {
            return TodoRequest.NotFound('Todo not found');
        }
        if (state && !this.validTodoStateUpdate(currentTodo.state, state)) {
            return TodoRequest.BadRequest('Invalid state update');
        }
        const updatedTodo = await this.todoService.updateTodoById(id, { id, title, description, owner, state });
        return TodoRequest.SuccessRequest(updatedTodo);
    }

    async deleteTodoById(request: Request): Promise<Response> {
        const id = request.params['id'];
        const todo = await this.todoService.findTodoById(id);
        if (!todo) {
            return TodoRequest.NotFound('Todo not found');
        }
        await this.todoService.deleteTodoById(id);
        return TodoRequest.SuccessRequest(todo);
    }

    private validTodoStateUpdate(oldState: string, newState: string): boolean {
        const predecessingList = ['todo', 'in-progress', 'done'];
        const oldStateIndex = predecessingList.indexOf(oldState);
        const newStateIndex = predecessingList.indexOf(newState);
        return oldStateIndex < newStateIndex;
    }
}

export class TodoRequest {
    static CreatedRequest(message: Todo) {
        return this.format(201, message)
    }
    static SuccessRequest(message: Todo | Todo[]) {
        return this.format(200, message)
    }
    static BadRequest(message: string) {
        return this.format(400, { error: message })
    }
    static NotFound(message: string) {
        return this.format(404, { error: message })
    }
    static InternalServerError(message: string) {
        return this.format(500, { error: message })
    }
    private static format(code: number, message: any) {
        return {
            status: code,
            body: {
                timestamp: new Date().toISOString(),
                traceback: uuidv4(),
                result: message
            }
        }
    }
}