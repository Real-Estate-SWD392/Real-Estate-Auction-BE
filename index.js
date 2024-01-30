// DEFINE LIBRARY
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// DEFINE DATABASE
const db = require("./config/database");

// DEFINE ROUTER
const authRouter = require("./router/auth.router");
const realEstateRouter = require("./router/real-estate.router");
const accountRouter = require("./router/account.router");
const memberRouter = require("./router/member.router");
const auctionRouter = require("./router/auction.router");
const provinceRouter = require("./router/province.router");
const addressRouter = require("./router/address.router");
const passport = require("passport");
const authenticateJWT = require("./utils/authenticateJWT");

// DEFINE EXPRESS
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(
  cookie({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// DEFINE PORT
const port = parseInt(process.env.PORT) || 5000;

// DEFINE ROUTER LINK
app.use("/auth", authRouter);
app.use("/real-estate", authenticateJWT, realEstateRouter);
app.use("/member", authenticateJWT, memberRouter);
app.use("/auction", authenticateJWT, auctionRouter);
app.use("/province", authenticateJWT, provinceRouter);
app.use("/address", addressRouter);
app.use("/account", accountRouter);

// CONNECT TO PORT
app.listen(port, (req, res) => {
  console.log(`Listen port: ${port}`);
});

// CONNECT DATABASE
db.connect();
