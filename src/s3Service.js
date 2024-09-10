import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

export const uploadFileToS3 = async (file, userId) => {
  const params = {
    Bucket: 'onesecbucket',
    Key: `images/${userId}/profile-pic.jpg`, // Use userId to ensure uniqueness
    Body: file,
    ContentType: file.type,
    CacheControl: 'no-cache',
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
