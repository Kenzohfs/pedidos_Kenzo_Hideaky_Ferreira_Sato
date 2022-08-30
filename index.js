const express = require("express");
const router = require("./router");

const port = 8080;
const app = express();

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
    console.log(`App listening on http://localhost:${ port }`);
});