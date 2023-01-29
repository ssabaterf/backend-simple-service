export type TodoStates = 'todo' | 'in-progress' | 'done';

export type Todo = {
    id: string;
    title: string;
    description: string;
    owner: string;
    state: TodoStates;
}