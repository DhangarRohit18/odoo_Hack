const prisma = require('../utils/prisma');
const { calculateTrustScore, processAutoApproval, detectAnomaly } = require('../services/expenseService');
const { convertAmount } = require('../services/currencyService');
const { processOCR } = require('../services/ocrService');
const { initializeApprovalFlow } = require('../services/approvalFlowService');

const submitExpense = async (req, res) => {
  try {
    const { amount, currency, category, date, description, receiptUrl } = req.body;
    const userId = req.user ? req.user.id : '1'; // Mock fallback

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }
    });

    if (!user) throw new Error('User not found');

    const convertedAmount = await convertAmount(amount, currency, user.company ? user.company.baseCurrency : 'USD');
    const { score, riskLevel, explanation } = await calculateTrustScore(req.body, userId);

    const expense = await prisma.expense.create({
      data: {
        amount,
        currency,
        convertedAmount,
        category,
        date: new Date(date),
        description,
        receiptUrl,
        trustScore: score,
        riskLevel,
        explanation,
        userId,
        status: 'PENDING'
      }
    });

    const isMajorAnomaly = await detectAnomaly(userId, convertedAmount);
    if (isMajorAnomaly) {
       await prisma.expense.update({
         where: { id: expense.id },
         data: { riskLevel: 'Risk', explanation: 'Major anomaly detected.' }
       });
    }

    const autoApproved = await processAutoApproval(expense.id, score, convertedAmount);
    
    // Only initialize the manual multi-level flow if it wasn't auto-approve
    if (!autoApproved) {
        await initializeApprovalFlow(expense.id, user.companyId || '1', userId);
    }

    res.status(201).json({
      expense,
      trustScore: score,
      riskLevel,
      explanation,
      convertedAmount,
      autoApproved
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user ? req.user.id : '1' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

const ocrProcess = async (req, res) => {
  try {
    if (!req.file) throw new Error('No receipt image uploaded');
    const ocrResult = await processOCR(req.file.path);
    res.json(ocrResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const convertCurrency = async (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;
    const convertedAmount = await convertAmount(amount, fromCurrency, toCurrency);
    res.json({ amount, fromCurrency, toCurrency, convertedAmount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { submitExpense, getExpenses, ocrProcess, convertCurrency };
