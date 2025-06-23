import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./static");
  },
  filename(req, file, cb) {
    const fileName = file.originalname;
    cb(null, file.originalname);
    return;
  },
});

const upload = multer({ storage });

export default upload;
