const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');

console.log("--> SE CARGARON LAS RUTAS DE AUTH <--");

// Public routes (Anyone can enter)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Private routes (Need Token/Session)
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/verify', authMiddleware, authController.verifyToken);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/profile/picture', authMiddleware, upload.single('avatar'), authController.updateProfilePicture);
router.post('/logout', authController.logout);

module.exports = router;
