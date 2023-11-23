// dbSetup.js
const sqlite3 = require('sqlite3').verbose();

const initDB = () => {
  const db = new sqlite3.Database('authdb.sqlite3');

  db.serialize(() => {
 
    db.run('DROP TABLE IF EXISTS users');

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      telefone TEXT,
      data_criacao DATETIME,
      ultimo_login DATETIME
      )
    `);
  });

  

  db.close();
};

module.exports = initDB;
