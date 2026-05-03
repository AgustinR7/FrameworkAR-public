const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure the folder exists
const uploadDir = path.join(__dirname, '../../uploads/profile-pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where and how the file is saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.id}_${uniqueSuffix}${ext}`);
  }
});

// Only images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo no es una imagen'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = upload;