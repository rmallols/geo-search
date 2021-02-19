const express = require('express');
const app = express();
const port = 3001;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    //todo: create a db component and isolate
    //todo: return empty is num chars is low
    var sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database(`${__dirname}/data_GB.db`, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            app.get('/location', async (req, res) => {
                const { q } = req.query;
                const results = await runSelectQuery(`SELECT geonameid, name FROM locations WHERE name LIKE '%${q}%'`, db);
                res.send(results);
            })
        }
    });
})

function runSelectQuery(query, db) {
    return new Promise(resolve => {
        let results = [];
        db.each(query, function (err, row) {
            if (err) {
                console.error(err.message);
            }
            results.push(row);
        }, () => resolve(results));
    });
}