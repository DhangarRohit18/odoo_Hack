const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const axios = require('axios');

const signup = async (req, res) => {
  try {
    const { email, password, name, role, country, companyName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let baseCurrency = 'USD';
    if (country) {
      try {
        const cResp = await axios.get(`https://restcountries.com/v3.1/name/${country}?fields=currencies`);
        if (cResp.data && cResp.data[0] && cResp.data[0].currencies) {
           baseCurrency = Object.keys(cResp.data[0].currencies)[0];
        }
      } catch (err) {
        console.warn('Could not fetch currency, defaulting to USD');
      }
    }

    const company = await prisma.company.create({
      data: {
        name: companyName || `${name}'s Company`,
        baseCurrency
      }
    });

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name, 
        role: 'ADMIN', // The first to sign up is admin
        country,
        companyId: company.id
      }
    });
    
    res.status(201).json({ user, company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };
