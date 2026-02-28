import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    let token = req.headers.get("token");

    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is required" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { email } = decoded;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in token" },
        { status: 401 }
      );
    }
    if (email !== "admin@chaletcafe.com") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    const orders = await Order.find({})
      .populate("user", "name email phone")
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 })
      .lean();
    const customers = await User.find({ isVerified: true })
      .select("name email phone")
      .lean();
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered" || order.status === "collected"
    );
    const totalRevenue = deliveredOrders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    const totalCustomers = customers.length;
    const totalPendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    return NextResponse.json(
      {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalPendingOrders,
        orders,
        customers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admin dashboard data" },
      { status: 500 }
    );
  }
}
