const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('authdb.sqlite3');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nome TEXT,
    email TEXT,
    senha TEXT,
    telefone TEXT,
    data_criacao TEXT,
    ultimo_login TEXT
  )
`);
