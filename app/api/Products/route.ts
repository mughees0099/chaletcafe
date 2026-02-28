import Product from "@/models/Product";
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import "@/models";
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const products = await (Product as any).find({}).lean();
    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, price, category, description, available, image } = body;

    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      price,
      category,
      available,
      image,
      description,
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Item created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { id, name, price, category, available, description, image } = body;

    if (!id || !name || !price || !category || !image || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedProduct = await (Product as any).findByIdAndUpdate(
      id,
      { name, price, category, available, image, description },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await (Product as any).findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
