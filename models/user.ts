import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^\d{11}$/.test(v);
        },
        message: "Phone number must be exactly 11 digits",
      },
      match: [
        /^\d{11}$/,
        "Phone number must be exactly 11 digits and contain only numbers",
      ],
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : model("User", userSchema);

export default User;
