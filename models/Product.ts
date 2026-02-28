import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Pizza", "Burgers", "Pasta", "Panini", "Snacks", "Desserts"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models && mongoose.models.Product
    ? mongoose.models.Product
    : mongoose.model("Product", productSchema);

export default Product;
