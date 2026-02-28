import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order";
import { sendEmail } from "@/lib/mailer";
import "@/models";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    await params;

    const orderId = params.slug;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const orderId = params.slug;
    const { status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const forEmail = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .lean();
    if (!forEmail) {
      return NextResponse.json(
        { error: "Order not found for email" },
        { status: 404 }
      );
    }
    if (status !== "pending") {
      const statusMeta: any = {
        pending: {
          color: "#FFD700", // yellow
          emoji: "🕒",
          title: "Order Pending",
          message:
            "We've received your order. Our team will call you shortly to confirm it.",
          buttonText: "View My Order",
        },
        approved: {
          color: "#00C853",
          emoji: "✅",
          title: "Order Approved",
          message: "Your order has been approved and will be prepared soon.",
          buttonText: "Track Order",
        },
        preparing: {
          color: "#FFA726",
          emoji: "👨‍🍳",
          title: "Preparing Your Order",
          message: "Our chefs are cooking your delicious meal. Get ready!",
          buttonText: "Track Status",
        },
        ready: {
          color: "#29B6F6",
          emoji: "🥡",
          title: "Your Order is Ready",
          message: "Your order is ready and will be picked up soon.",
          buttonText: "Track Order",
        },
        "out for delivery": {
          color: "#42A5F5",
          emoji: "🛵",
          title: "Out for Delivery",
          message: "Your food is on the way. Please stay available.",
          buttonText: "Track Delivery",
        },
        delivered: {
          color: "#66BB6A",
          emoji: "🎉",
          title: "Delivered Successfully",
          message: "Hope you enjoyed your meal! We'd love to serve you again.",
          buttonText: "Order Again",
        },
        cancelled: {
          color: "#EF5350",
          emoji: "❌",
          title: "Order Cancelled",
          message:
            "Your order has been cancelled. If this was a mistake, please contact support.",
          buttonText: "Contact Support",
        },
        collected: {
          color: "#8D6E63",
          emoji: "🙌",
          title: "Order Collected",
          message:
            "Thank you for collecting your order. We hope you enjoyed it!",
          buttonText: "Order Again",
        },
      };

      const meta = statusMeta[forEmail.status.toLowerCase()];
      const order_id = forEmail.orderId;
      const productRows = forEmail.products
        .map(
          (item) => `
    <tr>
      <td style="padding: 8px 12px;">${item.product.name}</td>
      <td align="center" style="padding: 8px 12px;">${item.quantity}</td>
      <td align="right" style="padding: 8px 12px;">PKR ${
        item.product.price
      }</td>
      <td align="right" style="padding: 8px 12px;">PKR ${
        item.product.price * item.quantity
      }</td>
    </tr>`
        )
        .join("");

      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Order ${order_id} – ${meta.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td align="center" style="background-color: ${
                meta.color
              }; padding: 30px;">
                <h2 style="margin: 0; color: #111;">${meta.emoji} ${
        meta.title
      }</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hello <strong>${
                  forEmail.user.name
                }</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                  ${meta.message}
                </p>

                <h3 style="margin-top: 30px;">🧾 Order Summary</h3>
                <table width="100%" border="1" cellspacing="0" style="border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                  <thead style="background-color: #f9f9f9;">
                    <tr>
                      <th align="left" style="padding: 8px 12px;">Item</th>
                      <th align="center" style="padding: 8px 12px;">Qty</th>
                      <th align="right" style="padding: 8px 12px;">Price</th>
                      <th align="right" style="padding: 8px 12px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productRows}
                    <tr>
                      <td colspan="3" align="right" style="padding: 8px 12px;"><strong>Grand Total:</strong></td>
                      <td align="right" style="padding: 8px 12px;"><strong>PKR ${
                        forEmail.totalAmount
                      }</strong></td>
                    </tr>
                  </tbody>
                </table>

                <p style="font-size: 16px; color: #333;">
                  <strong>Delivery Address:</strong><br/>
                  ${forEmail.deliveryAddress}
                </p>

                <div style="margin: 30px 0; text-align: center;">
                  <a href="https://chalet-cafe.vercel.app/dashboard" style="background-color: ${
                    meta.color
                  }; color: #111; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    ${meta.buttonText}
                  </a>
                </div>

                ${
                  forEmail.status === "cancelled"
                    ? `<div style="background-color: #ffe0e0; color: #a94442; padding: 15px; border-radius: 6px;">
                        <strong>Need help?</strong> This order was cancelled. If you didn’t expect this, please <a href="mailto:farisak018@gmail.com">contact support</a>.
                      </div>`
                    : ""
                }

                <p style="font-size: 14px; color: #999;">Thanks again for ordering with Chalet Cafe!</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Chalet Cafe. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

      await sendEmail(
        forEmail.user.email,
        `Order ${order_id} – ${meta.title}`,
        meta.message,
        html
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(error, { status: 500 });
  }
}
