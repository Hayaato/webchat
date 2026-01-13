const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/todos", require("./routes/todo.routes"));
app.use("/", require("./routes/auth.routes"));