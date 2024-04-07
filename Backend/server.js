const express = require('express')
const bookRouters = require('./src/books/routes.js')


const app = express();
const port = 3000;

app.use(express.json()); // allow us to post and get json from the endpoints.

app.get("/", (req, res) => {
    res.send("hello world.")
});

app.use('/api/v1/books', bookRouters); //v1-> version1 anlamına geliyor


app.listen(port, () => console.log(`app listening on port ${port}`));