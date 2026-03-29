const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const approvalController = require('../controllers/approvalController');

router.use(authenticateToken);
router.use(requireRole(['MANAGER', 'ADMIN']));

router.get('/pending', approvalController.getPendingApprovals);
router.post('/status', approvalController.updateApprovalStatus);

module.exports = router;
