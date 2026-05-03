const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

console.log("--> SE CARGARON LAS RUTAS DE ADMIN <--");

// All routes here require authentication and admin role
router.use(authMiddleware);
router.use(requireRole('admin'));

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id/password', adminController.resetUserPassword);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
