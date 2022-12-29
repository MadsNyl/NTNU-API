const express = require("express");
const cors = require("express");
const registerRouter = require("./routes/register.route.js");
const authRouter = require("./routes/auth.route.js");
const refreshTokenRouter = require("./routes/refresh.route.js");
const logoutRouter = require("./routes/logout.route.js");
const siteRouter = require("./routes/site.route.js");
const adminRouter = require("./routes/admin.route.js");
const magazineRouter = require("./routes/magazine.route.js");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions.js");
const credentials = require("./middleware/credentials.js");

const app = express();

// middleware
app.use(credentials);
app.use(cors(corsOptions));
app.options('/*', (_, res) => {
    res.sendStatus(200);
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/refresh", refreshTokenRouter);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/site", siteRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/magazine", magazineRouter);

app.listen(8080);
