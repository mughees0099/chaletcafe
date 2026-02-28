import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";
import Admin from "@/models/Admin";
import "@/models";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mailer";

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
    let user;
    if (!email) {
      return NextResponse.json(
        { error: "Email not found in token" },
        { status: 401 }
      );
    }
    if (email === "admin@chaletcafe.com") {
      user = await Admin.findOne({ email }).select("-password ").lean();
      if (!user) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    }
    user = await User.findOne({ email }).select("-password -__v").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    const { name, image, oldPassword, newPassword } = body;

    if (!name && !image && !oldPassword && !newPassword) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) {
      updateData.name = name;
    }
    if (image) {
      updateData.image = image;
    }
    if (oldPassword && newPassword) {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        return NextResponse.json(
          { error: "Old password is incorrect" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword, 12);

      const to = user.email;
      const subject = "Password Updated Successfully – Chalet Cafe";
      const text = `Hello ${user.name},

Your password has been updated successfully.

If you did not make this change, please contact our support team immediately.

Best regards,
Chalet Cafe Team
`;
      const html = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <head>
    <meta charset="UTF-8" />
    <title>Password Updated</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td align="center" style="background-color: #FFD700; padding: 30px;">
                <h1 style="margin: 0; color: #111;">Password Updated</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hello <strong>${
                  user.name
                }</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                  Your password has been <strong>updated successfully</strong>.
                </p>
                <p style="font-size: 16px; color: #333;">
                  If you did <strong>not</strong> perform this action, please contact our support team immediately to secure your account.
                </p>

                <div style="margin: 30px 0; text-align: center;">
                  <a href="https://chalet-cafe.vercel.app/contact" style="background-color: #FFD700; color: #111; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                    Contact Support
                  </a>
                </div>

                <p style="font-size: 14px; color: #999;">
                  Stay safe, <br />Chalet Cafe Team
                </p>
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
      await sendEmail(to, subject, text, html);
    }
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      select: "-password -__v",
    }).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
