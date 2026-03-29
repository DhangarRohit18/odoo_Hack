const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

router.get('/countries', adminController.getCountries);

router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

router.post('/users', adminController.createUser);
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
