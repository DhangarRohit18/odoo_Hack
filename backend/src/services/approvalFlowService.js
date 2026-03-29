const prisma = require('../utils/prisma');

const initializeApprovalFlow = async (expenseId, companyId, userId) => {
  // Find the company's rule
  const rule = await prisma.approvalRule.findFirst({
    where: { companyId },
    include: { steps: { orderBy: { stepOrder: 'asc' } } }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });

  // If no rule exists, fallback to standard manager approval (just add on)
  if (!rule || rule.steps.length === 0) {
    if (user.managerId) {
      await prisma.expenseApproval.create({
        data: {
          expenseId,
          approverId: user.managerId,
          stepOrder: 1,
          status: 'PENDING'
        }
      });
    }
    return;
  }

  // Generate approvals based on rule
  let currentStep = 1;
  if (rule.isManagerFirst && user.managerId) {
    await prisma.expenseApproval.create({
      data: {
        expenseId,
        approverId: user.managerId,
        stepOrder: currentStep,
        status: 'PENDING'
      }
    });
    currentStep++;
  }

  for (const step of rule.steps) {
    const approvers = await prisma.user.findMany({
      where: { companyId, role: step.role }
    });
    
    // Create an approval record for everyone in that role step
    for (const approver of approvers) {
      await prisma.expenseApproval.create({
        data: {
          expenseId,
          approverId: approver.id,
          stepOrder: currentStep,
          status: 'PENDING'
        }
      });
    }
    currentStep++;
  }
};

const processApprovalDecision = async (expenseApprovalId, status, comment) => {
  const approval = await prisma.expenseApproval.update({
    where: { id: expenseApprovalId },
    data: { status, comments: comment },
    include: { expense: { include: { approvals: { include: { approver: true } } } } }
  });

  const expense = approval.expense;

  if (status === 'REJECTED') {
    return prisma.expense.update({
      where: { id: expense.id },
      data: { status: 'REJECTED', explanation: comment }
    });
  }

  // Find the rule for this company
  const rule = await prisma.approvalRule.findFirst({
    where: { companyId: expense.user?.companyId || '1' } // Fallback to '1' locally
  });

  const allApprovals = expense.approvals;
  const currentStepNum = approval.stepOrder;
  const stepApprovals = allApprovals.filter(a => a.stepOrder === currentStepNum);

  let stepApproved = false;

  if (rule) {
    // Check specific approver rule (e.g. CFO)
    const specificApproverPassed = stepApprovals.some(a => 
      a.status === 'APPROVED' && a.approver.role === rule.specificApproverRole
    );
    
    // Check percentage rule
    const percentagePassed = rule.percentageReq ? 
      ((stepApprovals.filter(a => a.status === 'APPROVED').length / stepApprovals.length) * 100) >= rule.percentageReq 
      : false;

    stepApproved = specificApproverPassed || percentagePassed || stepApprovals.every(a => a.status === 'APPROVED');
  } else {
    // Default: Must all approve
    stepApproved = stepApprovals.every(a => a.status === 'APPROVED');
  }

  if (stepApproved) {
    // See if there's a next step
    const nextSteps = allApprovals.filter(a => a.stepOrder > currentStepNum);
    if (nextSteps.length > 0) {
      // Leave expense as pending, moving to next step. (Frontend views filter by PENDING & lowest stepOrder)
      return expense; 
    } else {
      // Final approval
      return prisma.expense.update({
        where: { id: expense.id },
        data: { status: 'APPROVED', explanation: 'All approval workflow steps passed.' }
      });
    }
  }

  return expense;
};

module.exports = { initializeApprovalFlow, processApprovalDecision };
