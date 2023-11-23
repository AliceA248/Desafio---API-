const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mensagem: 'E-mail já existente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const token = jwt.sign({ email: user.email, userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

const getUser = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { signUp, signIn, getUser };
