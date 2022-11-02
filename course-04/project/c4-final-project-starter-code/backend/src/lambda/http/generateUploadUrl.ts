import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateUploadUrl} from "../../businessLogic";
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('TodosAccess');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    try {
		const userId = getUserId(event);
		const todoId = event.pathParameters.todoId;

		const URL = await generateUploadUrl(todoId, userId);

		return {
			statusCode: 202,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				uploadUrl: URL,
			})
		};
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