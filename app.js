const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const app = express();

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

const mongo_url = "mongodb://127.0.0.1:27017/AbodeAway";

main()
  .then(() => console.log("Connection to DB Successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("Hi! I am Root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
