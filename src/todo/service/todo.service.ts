import { Todo } from "../model/todo.model";

export type ITodoService = {
    addTodo(todo:Todo): Promise<Todo>;
    listTodos(): Promise<Todo[]>;
    findTodoById(id: string): Promise<Todo>;
    updateTodoById(id: string, todo: Todo): Promise<Todo>;
    deleteTodoById(id: string): Promise<Todo>;
}

export class TodoService implements ITodoService {
    constructor() {

    }
    addTodo(): Promise<Todo> {
        throw new Error("Method not implemented.");
    }
    listTodos(): Promise<Todo[]> {
        throw new Error("Method not implemented.");
    }
    findTodoById(id: string): Promise<Todo> {
        throw new Error("Method not implemented.");
    }
    updateTodoById(id: string, todo: Todo): Promise<Todo> {
        throw new Error("Method not implemented.");
    }
    deleteTodoById(id: string): Promise<Todo> {
        throw new Error("Method not implemented.");
    }
}