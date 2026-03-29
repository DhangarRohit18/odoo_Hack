const prisma = require('../utils/prisma');
const axios = require('axios');

const BASE_EXCHANGERATE_API = 'https://api.exchangerate-api.com/v4/latest/';

const convertAmount = async (amount, fromCurrencyCode, toCurrencyCode) => {
  if (fromCurrencyCode === toCurrencyCode) return amount;

  const cacheKey = `${fromCurrencyCode}_${toCurrencyCode}`;
  const cachedRate = await prisma.currencyRate.findUnique({
    where: { code: cacheKey }
  });

  let rate;
  const isCacheExpired = cachedRate && (new Date().getTime() - new Date(cachedRate.lastUpdated).getTime() > 24 * 60 * 60 * 1000);

  if (!cachedRate || isCacheExpired) {
    try {
      const response = await axios.get(`${BASE_EXCHANGERATE_API}${fromCurrencyCode}`);
      rate = response.data.rates[toCurrencyCode] || 1.0;
      
      await prisma.currencyRate.upsert({
        where: { code: cacheKey },
        update: { rate, lastUpdated: new Date() },
        create: { code: cacheKey, rate, lastUpdated: new Date() }
      });
    } catch (error) {
       console.error('Error fetching exchange rate:', error);
       rate = 1.0;
    }
  } else {
    rate = cachedRate.rate;
  }

  return amount * rate;
};

module.exports = { convertAmount };
