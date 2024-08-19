import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: 'onesecbucket',
    Key: `images/${file.name}`,
    Body: file,
    ContentType: file.type,
    // ACL: 'public-read',
    CacheControl: 'no-cache' 
  };

  try {
    console.log('Uploading file:', params);
    const data = await s3.upload(params).promise();
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
