const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Photographers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        document TEXT NOT NULL,
        company_name TEXT NOT NULL,
        logo TEXT NOT NULL,
        description TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        photographer_id INTEGER NOT NULL,
        FOREIGN KEY (photographer_id) REFERENCES Photographers(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_hash TEXT NOT NULL,
        download_count INTEGER DEFAULT 0,
        download_limit INTEGER DEFAULT 0,
        folder_id INTEGER NOT NULL,
        FOREIGN KEY (folder_id) REFERENCES Folders(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        album_id INTEGER NOT NULL,
        FOREIGN KEY (album_id) REFERENCES Albums(id)
    )`);
});

module.exports = db;