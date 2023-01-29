import { Todo } from "../model/todo.model";

export type PostTodo = Omit<Omit<Todo, 'id'>, "state">;
export type PutTodo = Omit<Todo, 'id'>;
