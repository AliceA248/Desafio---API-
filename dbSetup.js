// dbSetup.js
const sqlite3 = require('sqlite3').verbose();

const initDB = () => {
  const db = new sqlite3.Database('authdb.sqlite3');

  db.serialize(() => {
    // Dropando a tabela se existir (remova se não for apropriado para a produção)
    db.run('DROP TABLE IF EXISTS users');

    // Criação da tabela users
    db.run(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        nome TEXT,
        email TEXT,
        senha TEXT,
        telefone TEXT,
        data_criacao TEXT,
        ultimo_login TEXT
      )
    `);
  });

  db.close();
};

module.exports = initDB;
