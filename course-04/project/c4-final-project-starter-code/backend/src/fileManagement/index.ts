import * as AWS from 'aws-sdk';
import "aws-xray-sdk";

const AWS_XRAY =require("aws-xray-sdk")
const XAWS = AWS_XRAY.captureAWS(AWS)
const urlExp = process.env.SIGNED_URL_EXPIRATION;
const bucketName = process.env.S3_BUCKET_NAME;
const S3 = new XAWS.S3({
	signatureVersion: "v4"
})


// TODO: Implement the fileStogare logic
export async function deleteBucket(todoId: string){
	return await S3.deleteObject({
		Bucket: bucketName,
		Key: todoId
	});
}

export function getUploadUrl(todoId: string){
	return S3.getSignedUrl('putObject',{
		Bucket: bucketName,
		Key: todoId,
		Expires: parseInt(urlExp)
	})
}
