const express = require('express');
const bodyParser = require('body-parser');
const initDB = require('./dbSetup');
const authRoutes = require('./src/routers/authRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


initDB();

app.get('/', (req, res) => {
  res.send('Tudo certo!');
});

app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`O servidor está roadando na porta ${PORT}`);
});
