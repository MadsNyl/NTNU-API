const express = require("express");
const cors = require("express");
const registerRouter = require("./routes/register.route.js");
const authRouter = require("./routes/auth.route.js");
const refreshTokenRouter = require("./routes/refresh.route.js");
const logoutRouter = require("./routes/logout.route.js");
const siteRouter = require("./routes/site.route.js");
const adminRouter = require("./routes/admin.route.js");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/refresh", refreshTokenRouter);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/site", siteRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(8080);
