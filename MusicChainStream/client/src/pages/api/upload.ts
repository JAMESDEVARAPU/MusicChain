// client/pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { file } = req.body;

  try {
    const uploadRes = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Detects if it's audio/video
      folder: "songs", // Optional folder in your Cloudinary
    });

    res.status(200).json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err });
  }
}
