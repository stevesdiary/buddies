import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types';
import { Readable } from 'stream';

export async function uploadImageToCloudinary(
  image: string | Readable
): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    let uploadResult: CloudinaryResponse;

    if (typeof image === 'string') {
      // If image is a string (file path or URL), upload directly
      uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'uploads',
      }) as CloudinaryResponse;
    } else {
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'uploads' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResponse);
          }
        );
        image.pipe(uploadStream);
      });
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}
