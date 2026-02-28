"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Banknote } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { toast } from "react-toastify";
import axios from "axios";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface CheckoutFormProps {
  user: any;
  orderType: "delivery" | "pickup";
  selectedBranch: string;
  branches: Branch[];
}

export default function CheckoutForm({
  user,
  orderType,
  selectedBranch,
  branches,
}: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const router = useRouter();
  const { clearCart } = useCart();
  const { cartItems, totalPrice } = useCart();

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: "",
    city: "Islamabad",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation for pickup orders
    if (orderType === "pickup" && !selectedBranch) {
      toast.error("Please select a branch for pickup");
      setIsSubmitting(false);
      return;
    }

    if (paymentMethod === "online") {
      toast.warn("Currently online payment is not available.");
      setIsSubmitting(false);
      return;
    }

    try {
      const deliveryFee = orderType === "delivery" ? 150 : 0;
      const selectedBranchData = branches.find((b) => b.id === selectedBranch);

      const response = await axios.post("/api/orders", {
        user: user._id,
        products: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        paymentMethod,
        totalAmount: totalPrice + deliveryFee,
        notes: formData.notes,
        orderType,
        deliveryAddress: orderType === "delivery" ? formData.address : null,
        pickupBranch:
          orderType === "pickup"
            ? {
                branchId: selectedBranch,
                branchName: selectedBranchData?.name,
                branchAddress: selectedBranchData?.address,
                branchPhone: selectedBranchData?.phone,
              }
            : null,
      });

      if (response.status === 201) {
        toast.success("Order placed successfully!");
        router.push(`/order-confirmation?orderId=${response.data._id}`);
        clearCart();
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {orderType === "delivery"
                ? "Delivery Information"
                : "Contact Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  required
                />
              </div>
              {orderType === "delivery" && (
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    placeholder="Islamabad"
                    required
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}
            </div>

            {orderType === "delivery" && (
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House #123, Street #45, Sector F-7, Islamabad"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={
                  orderType === "pickup"
                    ? "Special instructions for food preparation or pickup time preferences"
                    : "Special instructions for delivery or food preparation"
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cod" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cod">
                  {orderType === "delivery"
                    ? "Cash on Delivery"
                    : "Cash on Pickup"}
                </TabsTrigger>
                <TabsTrigger value="online">Online Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="cod" className="pt-4">
                <div className="flex items-center space-x-2 p-4 bg-secondary rounded-md">
                  <Banknote className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {orderType === "delivery"
                        ? "Cash on Delivery"
                        : "Cash on Pickup"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {orderType === "delivery"
                        ? "Pay with cash when your order is delivered"
                        : "Pay with cash when you pick up your order"}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="online" className="pt-4">
                <div className="space-y-4">
                  <RadioGroup defaultValue="easypaisa">
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="easypaisa" id="easypaisa" />
                      <Label htmlFor="easypaisa" className="flex items-center">
                        <img
                          src="/placeholder.svg?height=30&width=80&text=Easypaisa"
                          alt="Easypaisa"
                          className="h-4 w-8 mr-2"
                        />
                        Easypaisa
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="jazzcash" id="jazzcash" />
                      <Label htmlFor="jazzcash" className="flex items-center">
                        <img
                          src="/placeholder.svg?height=30&width=80&text=JazzCash"
                          alt="JazzCash"
                          className="h-4 w-8 mr-2"
                        />
                        JazzCash
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Credit/Debit Card
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          disabled={isSubmitting || (orderType === "pickup" && !selectedBranch)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
              Order...
            </>
          ) : (
            `Place Order ${
              paymentMethod === "cod"
                ? orderType === "delivery"
                  ? "(Cash on Delivery)"
                  : "(Cash on Pickup)"
                : "(Pay Online)"
            }`
          )}
        </Button>
      </div>
    </form>
  );
}
