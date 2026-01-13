const express = require("express");
const path = require("path");
require("./src/config/env");
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

//app.use("/", require("./src/routes/todo.routes"));
app.use("/auth", require("./src/routes/auth.routes"));

app.listen(3000, () => {
    console.log("http://localhost:3000");
});