import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {getUserToDo} from "../../businessLogic";
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('TodosAccess');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const userId = getUserId(event);

	try {
		const toDos = await getUserToDo(userId);

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				"items": toDos,
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