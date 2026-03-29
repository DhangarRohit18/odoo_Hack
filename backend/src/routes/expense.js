const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/submit', expenseController.submitExpense);
router.get('/history', expenseController.getExpenses);
router.post('/ocr', upload.single('receipt'), expenseController.ocrProcess);
router.post('/convert', expenseController.convertCurrency);

module.exports = router;
