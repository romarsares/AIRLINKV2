// Express used for test server functionality
const express = require('express');
const app = express();
const PORT = 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});