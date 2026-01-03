import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export default cloudinary;

export function buildCloudinaryUrl({ publicId }: { publicId: string }) {
  return `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/${publicId}`;
}
