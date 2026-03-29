const Tesseract = require('tesseract.js');
const fs = require('fs');

const processOCR = async (filePath) => {
   try {
      const { data: { text, confidence } } = await Tesseract.recognize(filePath, 'eng');
      const result = parseReceiptText(text);
      let totalConfidence = confidence;
      if (!result.amount) totalConfidence -= 20;
      if (!result.vendor) totalConfidence -= 10;
      
      return {
         ...result,
         confidenceScore: Math.max(0, Math.min(100, totalConfidence))
      };
   } catch (error) {
      console.error('OCR Processing error:', error);
      throw new Error('Failed to analyze receipt.');
   }
};

const parseReceiptText = (text) => {
   const lines = text.split('\n');
   const amountRegex = /(?:INR|Rs|₹|\$|€|USD|EUR)\s?(\d+(?:[.,]\d{2})?)|(\d+(?:[.,]\d{2})?)\s?(?:INR|Rs|₹|\$|€|USD|EUR)|TOTAL[:\s]+(\d+(?:[.,]\d{2})?)/i;
   const amountMatch = text.match(amountRegex);
   const amount = amountMatch ? parseFloat((amountMatch[1] || amountMatch[2] || amountMatch[3]).replace(',', '.')) : null;

   const dateRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(\d{4}[/-]\d{1,2}[/-]\d{1,2})/;
   const dateMatch = text.match(dateRegex);
   const date = dateMatch ? dateMatch[0] : null;

   const firstLine = lines[0].trim();
   const vendor = lines.slice(0, 3).find(l => /restaurant|cafe|hotel|inc|ltd|llc|shop|store|starbucks|uber|mcdonald/i.test(l)) || firstLine;

   let category = 'Others';
   if (/restaurant|cafe|food|meal|mcdonald|starbucks|burger|pizza/i.test(text)) category = 'Meals';
   else if (/hotel|inn|stay|room|booking/i.test(text)) category = 'Travel';
   else if (/uber|taxi|grab|flight|airline|train|bus/i.test(text)) category = 'Travel';
   else if (/office|paper|ink|supplies|staples|amazon/i.test(text)) category = 'Supplies';

   return {
      amount,
      date,
      vendor: vendor.slice(0, 50),
      category,
      description: `Auto-extracted from receipt: ${vendor.slice(0, 20)} on ${date || 'unknown date'}`
   };
};

module.exports = { processOCR };
