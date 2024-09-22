const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isSignedIn, isAuthor, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Create Route
router.post(
  "/",
  isSignedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE ROUTE
router.delete(
  "/:reviewId",
  isSignedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
