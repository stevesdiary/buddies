import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import { uploadImageToCloudinary } from "../services/mediaUploads";
import { Readable } from "node:stream";

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
		const user_id = req.query.user_id as string;
    if (!req.file || !user_id) {
      return res.status(400).json({ message: 'No file or user_id.' });
    }
		const fileBuffer = req.file.buffer;
    const stream = Readable.from(fileBuffer);
    const imageUrl = await uploadImageToCloudinary(stream, user_id);
    return res.status(200).json({
      message: 'Image uploaded successfully!',
      url: imageUrl,
    });
  } catch (error) {
		console.log('AN ERROR:', error)
    return res.status(500).json({ message: 'Error uploading image.', error });
  }
});

export default router;
