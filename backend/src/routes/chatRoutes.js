const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/users', chatController.getUsers);
router.get('/conversation/:targetUserId', chatController.getConversation);
router.get('/messages/:conversationId', chatController.getMessages);

module.exports = router;
