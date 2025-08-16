// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // don't store locally
const upload = multer({ storage });

export default upload;
