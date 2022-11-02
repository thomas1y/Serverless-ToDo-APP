import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
const uuidv4 = require('uuid/v4');
import 'aws-xray-sdk';
import { deleteBucket, getUploadUrl } from "../fileManagement";


export class ToDoAccess {
    constructor(
        private readonly DB: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTableName = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getTodoForUser(userId: string): Promise<TodoItem[]> {

        const result = await this.DB.query({
            TableName: this.todoTableName,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise();

        return result.Items as TodoItem[];
    }

    async createToDo(todoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
		const todoId =  uuidv4();

        const newTodo = {
			userId: userId,
			todoId: todoId,
			attachmentUrl:  "", 
			createdAt: new Date().getTime().toString(),
			done: false,
			...todoRequest,
		}

        await this.DB.put({
            TableName: this.todoTableName,
            Item: newTodo,
        }).promise();

        return newTodo as TodoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        const result = await this.DB.update({
            TableName: this.todoTableName,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
            ExpressionAttributeNames: {
                "#name": "name",
                "#dueDate": "dueDate",
                "#done": "done"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdate['name'],
                ":dueDate": todoUpdate['dueDate'],
                ":done": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        }).promise();
		
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {
        await this.DB.delete({
            TableName: this.todoTableName,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        }).promise();

		await deleteBucket(todoId);

        return "";
    }

    async generateUploadUrl(todoId: string, userId: string): Promise<string> {
        const url = getUploadUrl(todoId);
		const imageUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${todoId}`;

		await this.DB.update({
			TableName: this.todoTableName,
			UpdateExpression: "set attachmentUrl = :url",
			ExpressionAttributeValues: {":url": `${imageUrl}`},
			Key: {
				todoId,
				userId
			}
		}).promise();

        return url as string;
    }
}
