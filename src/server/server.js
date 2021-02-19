const express = require('express');
const app = express();
const port = 3001;

app.get('/api/test', (req, res) => {
    res.send({ foo: 'bar'});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})