// DEFINE LIBRARY
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs");
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
const chatBoxRouter = require("./router/chat-box.router");
const messageRouter = require("./router/message.router");
const bidRouter = require("./router/bid.router");
const billRouter = require("./router/bill.router");
const reportRouter = require("./router/report.router");

const passport = require("passport");
require("./services/passport");
const authenticateJWT = require("./utils/authenticateJWT");
const authorization = require("./utils/authorization");
const { STAFF_ROLE, MEMBER_ROLE, ADMIN_ROLE } = require("./constant/role");
const { auctionModel } = require("./models/auction.model");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    // "https://f-clubs-event-management.vercel.app",
  ],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "authorization",
  ],
};

app.get("/api", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});
// DEFINE EXPRESS
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use(
  "/real-estate",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  realEstateRouter
);
app.use(
  "/member",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE, ADMIN_ROLE]),
  memberRouter
);
app.use("/auction", auctionRouter);
app.use("/province", authenticateJWT, provinceRouter);
app.use("/address", addressRouter);
app.use(
  "/chatbox",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  chatBoxRouter
);
app.use(
  "/message",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  messageRouter
);
app.use("/account", authenticateJWT, accountRouter);

app.use(
  "/bid",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  bidRouter
);
app.use("/report", authenticateJWT, authorization([STAFF_ROLE]), reportRouter);

app.use(
  "/bill",
  authenticateJWT,
  authorization([STAFF_ROLE, MEMBER_ROLE]),
  billRouter
);

// CONNECT TO PORT
app.listen(port, (req, res) => {
  console.log(`Listen port: ${port}`);
});

async function updateCountdown() {
  try {
    const auctions = await auctionModel.find();

    auctions.forEach(async (auction) => {
      // Decrease countdown timer by 1 second

      if (auction.second > 0) {
        auction.second--;
      } else if (auction.minute > 0) {
        auction.second = 59;
        auction.minute--;
      } else if (auction.hour > 0) {
        auction.second = 59;
        auction.minute = 59;
        auction.hour--;
      } else if (auction.day > 0) {
        auction.second = 59;
        auction.minute = 59;
        auction.hour = 23;
        auction.day--;
      } else {
        // Time's up, stop the countdown
        auction.second = 0;
        auction.minute = 0;
        auction.hour = 0;
        auction.day = 0;
      }

      // Save updated auction
      await auction.save();
    });
  } catch (err) {
    console.error("Error updating countdown:", err);
  }
}

// Call updateCountdown function periodically (e.g., every second)
setInterval(updateCountdown, 1000);

// CONNECT DATABASE
db.connect();
