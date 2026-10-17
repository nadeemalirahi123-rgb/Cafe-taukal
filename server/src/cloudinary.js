import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Upload a base64 data-URI and return the secure HTTPS url. */
export async function uploadImage(dataUri, folder = "taukal/menu") {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    transformation: [{ width: 1000, crop: "limit", quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}

export default cloudinary;
