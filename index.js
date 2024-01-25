// DEFINE LIBRARY
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-session");
require("dotenv").config();

// DEFINE DATABASE
const db = require("./config/database");

// DEFINE ROUTER
const realEstateRouter = require("./router/real-estate.router");
const accountRouter = require("./router/account.router");
const memberRouter = require("./router/member.router");
const auctionRouter = require("./router/auction.router");
const googleRouter = require("./router/google.router");
const joinListMemberRouter = require("./router/join-list-member.router");
const passport = require("passport");

// DEFINE EXPRESS
const app = express();
app.use(express.json());
app.use(cors());

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
app.use("/real-estate", realEstateRouter);
app.use("/auth", googleRouter);
app.use("/member", memberRouter);
app.use("/auction", auctionRouter);
app.use("/join-list-member", joinListMemberRouter);
app.use("/", accountRouter);

// CONNECT TO PORT
app.listen(port, (req, res) => {
  console.log(`Listen port: ${port}`);
});

// CONNECT DATABASE
db.connect();
