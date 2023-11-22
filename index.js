const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ message: 'Login bem-sucedido!' });
    } else {
        res.status(401).json({ message: "Login falhou" });
    }
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (users.some(u => u.username === username)) {
        res.status(400).json({ message: "Usuário já existe" });
    } else {
        const newUser = { id: users.length + 1, username, password };
        users.push(newUser);
        res.json({ message: "Cadastro bem-sucedido!", user: newUser });
    }
});

app.listen(port, () => {
    console.log("Servidor rodando na porta ${port}");
});
