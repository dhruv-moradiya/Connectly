import multer, { FileFilterCallback } from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req:Express.Request, file:Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 20 * 1024 * 1024, // 20 MB
};

const upload = multer({
storage,
fileFilter,
limits
})

export {upload}