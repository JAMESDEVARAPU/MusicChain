
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadToCloudinary = async (file: Express.Multer.File, folder: string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readableStream = new Readable({
      read() {
        this.push(file.buffer);
        this.push(null);
      }
    });

    readableStream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};
