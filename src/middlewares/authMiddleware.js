const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Não autorizado' });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ mensagem: 'Sessão inválida' });
      } else {
        return res.status(401).json({ mensagem: 'Token inválido' });
      }
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
