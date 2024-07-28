const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default: "https://1drv.ms/i/s!Auc_jBqZjfoOh_NqC2daPb4oQ1PS2g?e=PZKI2c",
      set: (v) =>
        v === ""
          ? "https://1drv.ms/i/s!Auc_jBqZjfoOh_NqC2daPb4oQ1PS2g?e=PZKI2c"
          : v,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
