import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {deleteToDo} from "../../businessLogic";
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('TodosAccess');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    try {
		const userId = getUserId(event);
		const todoId = event.pathParameters.todoId;

		const deleteData = await deleteToDo(todoId, userId);

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: deleteData,
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