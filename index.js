const express = require("express");
const cors = require("express");
const registerRouter = require("./routes/register.route.js");
const authRouter = require("./routes/auth.route.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/auth", authRouter);


app.listen(8080);