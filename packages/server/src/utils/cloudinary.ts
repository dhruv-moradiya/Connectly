import streamifier from "streamifier";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { ICloudinaryFilesUpload, IUploadedFile } from "../types/type";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const uploadFilesToCloudinary = async ({
  files,
  folderNames,
}: ICloudinaryFilesUpload): Promise<IUploadedFile[]> => {
  configureCloudinary();

  try {
    const uploadPromises: Promise<UploadApiResponse>[] = files.map(
      (file, index) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: folderNames[index],
            },
            (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("Unknown Cloudinary upload error"));
            }
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      }
    );

    const responses = await Promise.all(uploadPromises);

    const data: IUploadedFile[] = responses.map((res) => ({
      original: res.secure_url,
      thumbnail: cloudinary.url(res.public_id, {
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "auto",
        format: "jpg",
      }),
      metaData: {
        bytes: res.bytes,
        publicId: res.public_id,
        format: res.format,
        resource_type: res.resource_type,
        created_at: res.created_at,
        asset_folder: res.asset_folder,
      },
    }));

    return data;
  } catch (error: unknown) {
    console.error("Error while uploading files to Cloudinary:", error);
    throw error;
  }
};

export { uploadFilesToCloudinary };
