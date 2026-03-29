const prisma = require('../utils/prisma');
const { processApprovalDecision } = require('../services/approvalFlowService');

const getPendingApprovals = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : '1';
    // Multi-level: get expenses where the user has a pending ExpenseApproval at the lowest step order that is not completely approved
    const approvals = await prisma.expenseApproval.findMany({
      where: {
        approverId: userId,
        status: 'PENDING',
        expense: { status: 'PENDING' }
      },
      include: {
        expense: { include: { user: true } }
      }
    });

    // Format them to match the legacy expected structure on the frontend so it "just adds on"
    const legacyFormatted = approvals.map(a => ({
       ...a.expense,
       approvalId: a.id,
       stepOrder: a.stepOrder
    }));

    res.json(legacyFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

const updateApprovalStatus = async (req, res) => {
  try {
    const { id, status, comment, approvalId } = req.body;
    
    // Support either the new approvalId or legacy logic fallback
    if (approvalId) {
      const updatedExpense = await processApprovalDecision(approvalId, status, comment);
      return res.json(updatedExpense);
    }
    
    // Legacy fallback logic
    const managerId = req.user ? req.user.id : '1';
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: { user: true }
    });
    if (!expense || expense.user.managerId !== managerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: { status, explanation: comment || `Processed: ${status}` }
    });
    
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPendingApprovals, updateApprovalStatus };
