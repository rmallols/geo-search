const express = require('express');
const app = express();
const { connectToDb } = require('./db');
const { getLocations } = require('./locations');

const port = 3001;

app.listen(port, async () => {
    console.log(`Locations app listening at port: ${port}`);
    const db = await connectToDb();
    app.get('/location', async (req, res) => {
        res.send(await getLocations(req.query.q, db));
    })
});