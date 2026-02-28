import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `ORD-${Date.now()}`,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    // New field for order type
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
      default: "delivery",
    },
    // Updated delivery address - now optional based on order type
    deliveryAddress: {
      type: String,
      trim: true,
      required: function () {
        return this.orderType === "delivery";
      },
    },
    // New field for pickup branch information
    pickupBranch: {
      branchId: {
        type: String,
        required: function () {
          return this.orderType === "pickup";
        },
      },
      branchName: {
        type: String,
        required: function () {
          return this.orderType === "pickup";
        },
      },
      branchAddress: {
        type: String,
        required: function () {
          return this.orderType === "pickup";
        },
      },
      branchPhone: {
        type: String,
        required: function () {
          return this.orderType === "pickup";
        },
      },
    },
    // Updated status enum to handle both delivery and pickup
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready", // For pickup orders - ready for collection
        "Out for Delivery", // For delivery orders
        "delivered", // For delivery orders
        "collected", // For pickup orders - customer has collected
        "cancelled",
      ],
      default: "pending",
    },
    estimatedTime: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    indexes: [{ orderType: 1 }, { status: 1 }, { user: 1 }, { createdAt: -1 }],
  }
);

orderSchema.pre("save", function (next) {
  if (this.orderType === "delivery" && !this.deliveryAddress) {
    return next(new Error("Delivery address is required for delivery orders"));
  }

  if (
    this.orderType === "pickup" &&
    (!this.pickupBranch || !this.pickupBranch.branchId)
  ) {
    return next(
      new Error("Pickup branch information is required for pickup orders")
    );
  }

  next();
});

orderSchema.methods.getStatusDisplay = function () {
  const statusMap = {
    pending: "Pending Confirmation",
    confirmed: "Confirmed",
    preparing: "Being Prepared",
    ready: this.orderType === "pickup" ? "Ready for Pickup" : "Ready",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    collected: "Collected",
    cancelled: "Cancelled",
  };

  return statusMap[this.status] || this.status;
};

// Add a method to get next possible statuses
orderSchema.methods.getNextStatuses = function () {
  const statusFlow = {
    delivery: {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["out_for_delivery", "cancelled"],
      out_for_delivery: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    },
    pickup: {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["ready", "cancelled"],
      ready: ["collected", "cancelled"],
      collected: [],
      cancelled: [],
    },
  };

  return statusFlow[this.orderType]?.[this.status] || [];
};

// Add a virtual for order type display
orderSchema.virtual("orderTypeDisplay").get(function () {
  return this.orderType === "delivery" ? "Home Delivery" : "Store Pickup";
});

// Add a virtual for location display
orderSchema.virtual("locationDisplay").get(function () {
  if (this.orderType === "delivery") {
    return this.deliveryAddress;
  } else {
    return `${this.pickupBranch?.branchName} - ${this.pickupBranch?.branchAddress}`;
  }
});

// Ensure virtuals are included when converting to JSON
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const Order =
  mongoose.models && mongoose.models.Order
    ? mongoose.models.Order
    : mongoose.model("Order", orderSchema);

export default Order;
