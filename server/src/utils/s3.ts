import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  import { config } from "dotenv";
  config({
    path: ".env"
  });
  
  const bucketName = process.env.AWS_BUCKET_NAME!;
  const bucketRegion = process.env.AWS_REGION!;
  const accesskey = process.env.AWS_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

  // S3 Client to interact with AWS S3.
  const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
      accessKeyId: accesskey,
      secretAccessKey,
    },
  });
  
  // Type for upload function, to make it reusable for any type of data
  type UploadToS3Type<T extends Buffer | Uint8Array | ReadableStream<any>> = {
    data: T;
    contentType: string;
    key: string;
  };
  
  // Upload service: Uploads data to S3 and returns signed URL
  export const uploadToS3 = async <T extends Buffer | Uint8Array | ReadableStream<any>>({
    data,
    contentType,
    key,
  }: UploadToS3Type<T>) => {
    const command = new PutObjectCommand({
      Body: data, // Now 'data' is guaranteed to be one of the allowed types
      ContentType: contentType,
      Key: key,
      Bucket: bucketName,
    });
  
    await s3.send(command); // Upload file to S3
  };
  
  // Delete object from S3
  export const deleteObjectS3 = async ({ key }: { key: string }): Promise<void> => {
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: bucketName,
    });
    await s3.send(command);
  };
  
  // Get signed URL for S3 operations
  export const getSignedUrlAWS = async (
    command: GetObjectCommand | PutObjectCommand | DeleteObjectCommand,
    expiresIn: number = 3600 // Default to 1 hour
  ): Promise<string> => {
    return await getSignedUrl(s3, command, { expiresIn });
  };
  
  // Retrieve signed URL to access an object in S3
  export const getObject = async ({
    key,
  }: {
    key: string;
  }): Promise<string> => {
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
  
    const signedUrl = await getSignedUrlAWS(getCommand);
  
    return signedUrl;
  };  