const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// We'll require the routes later once we convert them, or use ts-node for them if needed.
// For now, let's just see if the base server starts.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Mock routes for now if we want to test base connectivity
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// For simplicity, let's keep the existing logic but use require
const authRoutes = require('./routes/auth').default || require('./routes/auth');
const expenseRoutes = require('./routes/expense').default || require('./routes/expense');
const approvalRoutes = require('./routes/approval').default || require('./routes/approval');
const adminRoutes = require('./routes/admin').default || require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Intelligent Backend running on http://localhost:${PORT}`);
});
