import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoAccess} from "../dataLayer";


const toDoAccess = new ToDoAccess();

export async function getUserToDo(userId: string): Promise<TodoItem[]> {
	const Todo = await toDoAccess.getTodoForUser(userId);
    return Todo;
}

export async function createUserToDo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
	const todo = await toDoAccess.createToDo(createTodoRequest, userId);
    return todo;
}

export async function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    const todo = await toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
    return todo;
}

export async function deleteToDo(todoId: string, userId: string): Promise<string> {
    const todo = await toDoAccess.deleteToDo(todoId, userId);
    return todo
}

export async function generateUploadUrl(todoId: string, userId: string): Promise<string> {
	const url = await toDoAccess.generateUploadUrl(todoId, userId);
    return url
}