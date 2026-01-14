const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Initialize SQLite database with sql.js
const initializeDatabase = async () => {
  const SQL = await initSqlJs();

  // Try to load existing database
  try {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('✅ Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('✅ Created new database');
    }
  } catch (error) {
    console.log('Creating new database...');
    db = new SQL.Database();
  }

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      priority TEXT CHECK(priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
      status TEXT CHECK(status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
      dueDate TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      userId TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_userId ON tasks(userId)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate)`);

  // Save database to file
  saveDatabase();

  console.log('✅ Database initialized successfully');
};

// Save database to file
const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Database wrapper methods to match better-sqlite3 API
const dbWrapper = {
  prepare: (sql) => ({
    run: (...params) => {
      db.run(sql, params);
      saveDatabase();
      return { changes: db.getRowsModified() };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const results = [];
      const stmt = db.prepare(sql);
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  }),
  exec: (sql) => {
    db.run(sql);
    saveDatabase();
  }
};

const getDb = () => dbWrapper;

module.exports = { db: dbWrapper, initializeDatabase, getDb, saveDatabase };
