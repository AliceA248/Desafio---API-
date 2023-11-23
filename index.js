const express = require('express');
const bodyParser = require('body-parser');
const initDB = require('./dbSetup'); // Adicionado para inicializar o banco de dados
const authRoutes = require('./src/routers/authRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Inicialização do banco de dados
initDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Rotas de autenticação
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
