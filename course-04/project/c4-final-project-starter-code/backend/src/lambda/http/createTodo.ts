import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {createUserToDo} from "../../businessLogic";
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('TodosAccess');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
	try {
		const userId = getUserId(event);

		const newTodo: CreateTodoRequest = JSON.parse(event.body);
		const toDoItem = await createUserToDo(newTodo, userId);

		return {
			statusCode: 201,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				"item": toDoItem
			}),
		}
	} catch (error) {
		logger.log('error', error);
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: "internal server error",
		}
	}
    
};