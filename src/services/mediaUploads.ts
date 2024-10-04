import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types';
import { Readable } from 'stream';
import User from '../models/User';
import { where } from 'sequelize';
export async function uploadImageToCloudinary(
  image: string | Readable,
  user_id: string
): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    let uploadResult: CloudinaryResponse;
    const publicId = `user_${user_id}_`;
    if (typeof image === 'string') {
      uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'uploads',
      }) as CloudinaryResponse;
    } else {
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'uploads',
            public_id: publicId
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResponse);
          }
        );
        image.pipe(uploadStream);
      });
    }
    const user = await User.findByPk(user_id);
    if (uploadResult.secure_url && user) {
      await user.update({ where: { dp: uploadResult.secure_url } });
    }
      
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}
