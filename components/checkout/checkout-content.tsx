"use client";

import { useCurrentUser } from "@/hooks/currentUser";
import CheckoutForm from "./checkout-form";
import OrderSummary from "./order-summary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useCart } from "../cart/cart-provider";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Truck } from "lucide-react";

// Sample branches - you can move this to a config file or fetch from API
const branches = [
  {
    id: "f7",
    name: "F-7 Markaz Branch",
    address: "Shop #12, F-7 Markaz, Islamabad",
    phone: "+92 51 2345678",
  },
];

export default function CheckoutContent() {
  const { user, loading } = useCurrentUser();
  const { cartItems, totalPrice } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [selectedBranch, setSelectedBranch] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                Please log in first to continue with your booking.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Button asChild className="flex-1">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Please add some items to your cart before proceeding to checkout.
        </p>
        <Button asChild>
          <Link href="/menu">Go to Menu</Link>
        </Button>
      </div>
    );
  }

  if (user.role == "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Admin Access Denied</h2>
        <p className="text-gray-600 mb-6">
          Admins cannot proceed to checkout. Please log in with a customer
          account.
        </p>
        <Button asChild>
          <Link href="/login">Login as Customer</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center section-heading">
          Checkout
        </h1>

        {/* Order Type Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={orderType}
                onValueChange={(value: "delivery" | "pickup") => {
                  setOrderType(value);
                  if (value === "delivery") {
                    setSelectedBranch("");
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label
                    htmlFor="delivery"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Truck className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Home Delivery</p>
                      <p className="text-sm text-gray-500">
                        Get it delivered to your doorstep
                      </p>
                      <p className="text-sm text-primary font-medium">
                        Delivery Fee: Rs. 150
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label
                    htmlFor="pickup"
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Store Pickup</p>
                      <p className="text-sm text-gray-500">
                        Pick up from our store
                      </p>
                      <p className="text-sm text-green-600 font-medium">Free</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Branch Selection for Pickup */}
        {orderType === "pickup" && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a branch for pickup" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{branch.name}</span>
                          <span className="text-sm text-gray-500">
                            {branch.address}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedBranch && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    {(() => {
                      const branch = branches.find(
                        (b) => b.id === selectedBranch
                      );
                      return branch ? (
                        <div>
                          <h4 className="font-medium text-primary">
                            {branch.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {branch.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {branch.phone}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              user={user}
              orderType={orderType}
              selectedBranch={selectedBranch}
              branches={branches}
            />
          </div>
          <div>
            <OrderSummary orderType={orderType} />
          </div>
        </div>
      </div>
    </div>
  );
}
