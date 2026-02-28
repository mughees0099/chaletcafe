import User from "@/models/user";
import bcrypt from "bcrypt";
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import "@/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, phone, password, rememberMe } = body;

    if ((!email && !phone) || !password) {
      return NextResponse.json(
        { error: "Email/Phone and password are required" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (email === "admin@chaletcafe.com") {
      const admin = await Admin.findOne({ email });
      if (admin) {
        const pass = await bcrypt.hash(password, 12);
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
          );
        }

        const token = jwt.sign(
          {
            id: admin._id.toString(),
            email: admin.email,
            userType: admin.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: rememberMe ? "7d" : "1h",
          }
        );

        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
          path: "/",
        };
        const responseData = {
          success: true,
          token,
          userType: admin.role,
          user: {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.username || "Admin",
          },
        };
        const response = NextResponse.json(responseData);
        response.cookies.set("token", token, cookieOptions);
        return response;
      } else {
        return NextResponse.json(
          { error: "No admin found with this email" },
          { status: 401 }
        );
      }
    }

    let user;

    try {
      const searchQuery = email ? { email: email } : { phone: phone };

      user = await User.findOne(searchQuery).lean();
    } catch (dbError) {
      return NextResponse.json(
        { error: "Something went wrong please try again!" },
        { status: 500 }
      );
    }

    if (!user) {
      const loginMethod = email ? "email" : "phone number";
      return NextResponse.json(
        { error: `No user found with this ${loginMethod}` },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          error:
            "Account verification required. Please check your email for the OTP or register again.",
        },
        { status: 403 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 500 }
      );
    }

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("Password verification error:", bcryptError);
      return NextResponse.json(
        { error: "Password verification error" },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const userType = user.role;

    let token;
    try {
      token = jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
          userType: userType,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: rememberMe ? "7d" : "1h",
        }
      );
    } catch (jwtError) {
      console.error("Token generation error:", jwtError);
      return NextResponse.json(
        { error: "Token generation failed" },
        { status: 500 }
      );
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
      path: "/",
    };

    const responseData = {
      success: true,
      token,
      userType,
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        name: user.name || "User",
      },
    };

    const response = NextResponse.json(responseData);
    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
