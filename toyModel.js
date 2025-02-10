const mongoose = require("mongoose");

const toySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    img_url: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Toy", toySchema);
