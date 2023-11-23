const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('authdb.sqlite3');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secretpassword'); 

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Sessão inválida' });
    }

    return res.status(401).json({ mensagem: 'Não autorizado' });
  }
};

const signUp = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });

    if (existingUser) {
      return res.status(400).json({ mensagem: 'E-mail já está cadastrado' });
    }

    const id = uuidv4();
    const dataCriacao = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(senha, 10);

    db.run(
      'INSERT INTO users (id, nome, email, senha, telefone, data_criacao) VALUES (?, ?, ?, ?, ?, ?)',
      [id, nome, email, hashedPassword, JSON.stringify(telefone), dataCriacao],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }

        const token = generateToken(id, email);
        const dataAtualizacao = dataCriacao;
        const ultimoLogin = dataCriacao;

        res.status(201).json({ id, nome, email, telefone, dataCriacao, dataAtualizacao, ultimoLogin, token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};



const signIn = async (req, res) => {
  try {
    const { email, senha } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }

      if (!user) {
        return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      const passwordMatch = await bcrypt.compare(senha, user.senha);
      if (!passwordMatch) {
        return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      const token = generateToken(user.id, user.email);

      const ultimoLogin = new Date().toISOString();
      db.run('UPDATE users SET ultimo_login = ? WHERE id = ?', [ultimoLogin, user.id]);

      const dataAtualizacao = user.data_criacao;

      res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: JSON.parse(user.telefone),
        dataCriacao: user.data_criacao,
        dataAtualizacao,
        ultimoLogin,
        token,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

const getUser = (req, res) => {
  try {
    const userId = req.userData.userId;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }

      if (!user) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: JSON.parse(user.telefone),
        dataCriacao: user.data_criacao,
        dataAtualizacao: user.data_criacao,
        ultimoLogin: user.ultimo_login,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

const generateToken = (userId, userEmail) => {
  return jwt.sign({ userId, userEmail }, 'secretpassword', {
    expiresIn: '30m',
  });
};

module.exports = { signUp, signIn, getUser, verifyToken };