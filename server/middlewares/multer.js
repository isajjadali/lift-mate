import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage });

export default function () {
  return upload.single('image');
}
