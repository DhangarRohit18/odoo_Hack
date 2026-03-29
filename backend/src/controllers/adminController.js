const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;
    const adminId = req.user ? req.user.id : '1';
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin) throw new Error('Admin not found');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, companyId: admin.companyId, managerId }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const axios = require('axios');

const getCountries = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
    const dynamicData = response.data
      .filter(c => c.currencies && Object.keys(c.currencies).length > 0)
      .map(c => {
        const currencyCode = Object.keys(c.currencies)[0];
        const currencyObj = c.currencies[currencyCode];
        return {
          country: c.name.common,
          currency: currencyCode,
          symbol: currencyObj && currencyObj.symbol ? currencyObj.symbol : currencyCode
        };
      })
      .slice(0, 50); // Limit list for UI performance
    res.json(dynamicData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dynamic country data' });
  }
};

const getDashboardStats = async (req, res) => {
   try {
      const adminId = req.user ? req.user.id : '1';
      const admin = await prisma.user.findUnique({ where: { id: adminId } });
      if (!admin) throw new Error('Admin not found');
      const companyId = admin.companyId;
      const [totalExpenses, totalUsers, pendingCount] = await Promise.all([
         prisma.expense.aggregate({ where: { user: { companyId } }, _sum: { amount: true } }),
         prisma.user.count({ where: { companyId } }),
         prisma.expense.count({ where: { user: { companyId }, status: 'PENDING' } })
      ]);
      res.json({
         totalSpend: totalExpenses._sum.amount || 0,
         totalUsers,
         pendingCount
      });
   } catch (error) {
      res.status(500).json({ error: 'Failed' });
   }
};

module.exports = { createUser, getCountries, getDashboardStats };
