import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import { uploadImageToCloudinary } from "../services/mediaUploads";
import { Readable } from "node:stream";

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileBuffer = req.file.buffer;
    const stream = Readable.from(fileBuffer);
    const imageUrl = await uploadImageToCloudinary(stream);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ errorMessage: "Failed to upload image", error });
  }
});

export default router;
