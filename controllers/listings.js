const Listing = require("../models/listing.js");
const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken: `${mapToken}`,
});

module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Doesn't Exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  }

  newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let currListingImage = listing.image.url;
  currListingImage = currListingImage.replace(
    "/upload",
    "/upload/c_lfill,h_250,w_350"
  );
  if (!listing) {
    req.flash("error", "Listing Doesn't Exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, currListingImage });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Successfully");
  return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("owner");
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted successfully");
  res.redirect("/listings");
};
