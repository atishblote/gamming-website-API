const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// routes
const adminBackendRoutes = require("./api/routes/adminBackendRoutes");
const blogsRouter = require("./api/routes/blogRoutes");
const authorRouter = require("./api/routes/authorRouters");
const commentRouter = require("./api/routes/commentRouters");
const categoryRouter = require("./api/routes/categoryRouters");
const mediaRoutes = require("./api/routes/mediaRouters");
const tagRouters = require("./api/routes/tagRouterss");
const viewBlogsRouters = require("./api/routes/viewBlogsRouters");
const adminRouters = require("./api/routes/adminRoutes");

const paymentRoutes = require("./api/routes/paymentRoutes");
//user router
const userFantacy = require("./api/routes/fantacyRoutes");
const blogFantacy = require("./api/routes/viewBlogFantacy");
// create account
const userAccount = require("./api/routes/userRoutes");

// View Routes
const Websites = require("./api/routes/websiteRoutes");
const Matches = require("./api/routes/matchesRoutes");
const Promotions = require("./api/routes/promotionRoutes");



// const userRoutes = require("./api/routes/user");
// const pageRoutes = require("./api/routes/pages");

// connnect mongoose
mongoose
  .connect(
    "mongodb+srv://buzz:QERzYDgM85byxjX8@cluster0.pjq7ibn.mongodb.net/gamming-sites"
  )
  .then(() => {
    console.log("Connect Mongo atlas successfuly");
  })
  .catch(() => {
    console.log("Not Connect Mongo atlas");
  });

// morgan middleware

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // This is where your EJS templates will be stored

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // Corrected header name
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


// Configure rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: {
    code: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Send rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// handle reqest
app.use("/backend", adminBackendRoutes);
app.use("/blog", blogsRouter);
app.use("/author", authorRouter);
app.use("/comment", commentRouter);
app.use("/category", categoryRouter);
app.use("/media", mediaRoutes);
app.use("/tag", tagRouters);
app.use("/all-blogs", viewBlogsRouters);
app.use("/admin", adminRouters);
app.use("/payment", paymentRoutes);
app.use("/user", userAccount);

//
app.use("/upcomming-fantacy", userFantacy);
app.use("/blog-fantacy", apiLimiter ,blogFantacy);
app.use("/all-websites",apiLimiter, Websites);
app.use("/all-matches",apiLimiter, Matches );
app.use("/all-promotions",apiLimiter, Promotions );


// app.use("/upload", uploadRoutes);
// app.use("/user", userRoutes);
// app.use("/pages", pageRoutes);

// error handling

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
