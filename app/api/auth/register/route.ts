import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";
import Admin from "@/models/Admin";
import "@/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (email === "admin@chaletcafe.com") {
      const pass = await bcrypt.hash(password, 12);
      const existingAdmin = await Admin.findOne({
        email: "admin@chaletcafe.com",
      });
      if (existingAdmin) {
        return NextResponse.json({ error: "invalid email" }, { status: 400 });
      } else {
        const admin = await Admin.create({
          username: "Chalet Cafe",
          email: "admin@chaletcafe.com",
          password: pass,
        });
        if (admin) {
          return NextResponse.json(
            { message: "Admin created successfully" },
            { status: 201 }
          );
        }
      }
      return NextResponse.json(
        { error: "Admin creation failed" },
        { status: 500 }
      );
    }

    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    let existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
