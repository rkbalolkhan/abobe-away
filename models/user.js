const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMangoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1723449731~exp=1723453331~hmac=f2f210b09d654227fd897bb097e42717393b06a476a567bc9f38f934267ff9d1&w=740",
    set: (v) =>
      v === ""
        ? "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1723449731~exp=1723453331~hmac=f2f210b09d654227fd897bb097e42717393b06a476a567bc9f38f934267ff9d1&w=740"
        : v,
  },
});

userSchema.plugin(passportLocalMangoose);

module.exports = mongoose.model("User", userSchema);