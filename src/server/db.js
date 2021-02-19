const sqlite3 = require('sqlite3').verbose();

const connectToDb = () => {
    return new Promise((resolve, reject) => {
        const dbLocation = `${__dirname}/data/data_GB.db`;
        const dbAccess = sqlite3.OPEN_READONLY;
        const db = new sqlite3.Database(dbLocation, dbAccess, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(db);
            }
        });
    });
};

const runSelectQuery = (query, db) => (
    new Promise(resolve => {
        let results = [];
        db.each(query, function (err, row) {
            if (err) {
                console.error(err.message);
            }
            results.push(row);
        }, () => resolve(results));
    })
);

module.exports = { connectToDb, runSelectQuery };