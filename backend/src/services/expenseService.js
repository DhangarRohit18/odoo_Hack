const prisma = require('../utils/prisma');

const calculateTrustScore = async (expenseData, userId) => {
  let score = expenseData.confidenceScore || 90;
  let explanations = [];
  let riskLevel = 'Safe';

  if (expenseData.confidenceScore && expenseData.confidenceScore < 70) {
    explanations.push('OCR confidence is low.');
  }

  const categoryStats = await prisma.expense.aggregate({
    where: { category: expenseData.category, status: 'APPROVED' },
    _avg: { amount: true }
  });

  if (categoryStats._avg.amount) {
    const avg = categoryStats._avg.amount;
    if (expenseData.amount > avg * 1.5) {
      score -= 20;
      explanations.push('Amount deviates from average.');
    }
  }

  const duplicate = await prisma.expense.findFirst({
    where: {
      userId,
      amount: expenseData.amount,
      date: new Date(expenseData.date),
      category: expenseData.category
    }
  });

  if (duplicate) {
    score -= 50;
    explanations.push('Potential duplicate detected.');
  }

  score = Math.max(0, Math.min(100, score));
  if (score < 50) riskLevel = 'Risk';
  else if (score < 80) riskLevel = 'Review';

  return {
    score,
    riskLevel,
    explanation: explanations.join(' ') || 'No anomalies detected.'
  };
};

const processAutoApproval = async (expenseId, trustScore, amount) => {
  const threshold = 80;
  const amountLimit = 100;
  if (trustScore >= threshold && amount <= amountLimit) {
    await prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'APPROVED', explanation: 'Auto-approved.' }
    });
    return true;
  }
  return false;
};

const detectAnomaly = async (userId, amount) => {
  const userAvg = await prisma.expense.aggregate({
    where: { userId, status: 'APPROVED' },
    _avg: { amount: true }
  });
  if (userAvg._avg.amount && amount > userAvg._avg.amount * 3) {
    return true;
  }
  return false;
};

module.exports = { calculateTrustScore, processAutoApproval, detectAnomaly };
