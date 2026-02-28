"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  CreditCard,
  Clock,
  Printer,
  Package,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

type Order = {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    _id: string;
  }>;
  paymentMethod: string;
  totalAmount: number;
  notes: string;
  deliveryAddress: string;
  status:
    | "pending"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled"
    | "Out for Delivery";
  createdAt: string;
  updatedAt: string;
};

interface OrderDetailsDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export function OrderDetailsDialog({
  orderId,
  isOpen,
  onClose,
  orders,
}: OrderDetailsDialogProps) {
  const order = orders.find((o) => o._id === orderId);
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "pending"
  );
  const [updating, setUpdating] = useState(false);

  if (!order) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };
  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-orange-50 text-orange-700 border-orange-200",
      preparing: "bg-blue-50 text-blue-700 border-blue-200",
      ready: "bg-purple-50 text-purple-700 border-purple-200",
      "Out for Delivery": "bg-yellow-50 text-yellow-700 border-yellow-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      collected: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return (
      <Badge className={`${badges[status as keyof typeof badges]} px-3 py-1`}>
        {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  const calculateSubtotal = () => {
    return order.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = order.totalAmount - subtotal;

  const handlePrintPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt - ${order.orderId}</title>
          <style>
            body {
               font-family: Arial, sans-serif;
               margin: 20px;
               color: #333;
            }
            .header {
               text-align: center;
               border-bottom: 2px solid #333;
               padding-bottom: 20px;
               margin-bottom: 20px;
            }
            .cafe-name {
               font-size: 28px;
               font-weight: bold;
               color: #2563eb;
              margin-bottom: 5px;
            }
            .cafe-info {
               font-size: 14px;
               color: #666;
            }
            .order-info {
               display: flex;
               justify-content: space-between;
               margin-bottom: 20px;
            }
            .customer-info {
               margin-bottom: 20px;
            }
            .items-table {
               width: 100%;
               border-collapse: collapse;
               margin-bottom: 20px;
            }
            .items-table th, .items-table td {
               border: 1px solid #ddd;
               padding: 8px;
               text-align: left;
            }
            .items-table th {
               background-color: #f5f5f5;
               font-weight: bold;
            }
            .total-section {
               text-align: right;
               margin-top: 20px;
            }
            .total-row {
               display: flex;
               justify-content: space-between;
               margin-bottom: 5px;
            }
            .grand-total {
               font-size: 18px;
               font-weight: bold;
               border-top: 2px solid #333;
               padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="cafe-name">Chalet Cafe</div>
            <div class="cafe-info">
              📞 +92 51 1234567 | 📧 info@chaletcafe.com<br>
              📍 F-10 Markaz, Islamabad, Pakistan
            </div>
          </div>
          <div class="order-info">
            <div>
              <strong>Order ID:</strong> ${order.orderId}<br>
              <strong>Date:</strong> ${formatDate(order.createdAt)}<br>
              <strong>Status:</strong> ${currentStatus
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
            <div>
              <strong>Payment:</strong> ${
                order.orderType === "pickup"
                  ? "COP"
                  : order.paymentMethod.toUpperCase()
              }<br>
              <strong>Type:</strong> Delivery
            </div>
          </div>
          <div class="customer-info">
            <h3>Customer Information</h3>
            <strong>Name:</strong> ${order.user.name}<br>
            <strong>Email:</strong> ${order.user.email}<br>
            <strong>Address:</strong> ${
              order.orderType === "pickup"
                ? "Pickup from store"
                : order.deliveryAddress
            }<br>
          </div>
          <h3>Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.products
                .map(
                  (item) => `
                <tr>
                  <td>${item.product.name}</td>
                  <td>Rs. ${item.product.price}</td>
                  <td>${item.quantity}</td>
                  <td>Rs. ${item.product.price * item.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>Rs. ${subtotal}</span>
            </div>
            <div class="total-row">
              <span>Delivery Fee:</span>
              <span>Rs. ${deliveryFee}</span>
            </div>
            <div class="total-row grand-total">
              <span>Grand Total:</span>
              <span>Rs. ${order.totalAmount}</span>
            </div>
          </div>
          ${
            order.notes
              ? `
            <div style="margin-top: 20px;">
              <strong>Special Instructions:</strong><br>
              ${order.notes}
            </div>
          `
              : ""
          }
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
            Thank you for choosing Chalet Cafe!<br>
            For any queries, contact us at +92 51 1234567
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      const response = await axios.patch(`/api/orders/${order._id}`, {
        status: newStatus,
      });
      if (response.status === 200) {
        setCurrentStatus(newStatus as Order["status"]);
        toast.success("Order status updated successfully!");
        onClose();
        window.location.reload(); // Refresh to reflect changes
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };
  console.log("Order Details:", order);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Order Details
            </DialogTitle>
            <div className="flex items-center gap-3">
              {getStatusBadge(currentStatus)}
              <Button
                onClick={handlePrintPDF}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Date
                      </p>
                      <p className="font-medium">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Method
                      </p>
                      <p className="font-medium capitalize">
                        {order.orderType === "pickup"
                          ? "COP"
                          : order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.products.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Rs. {item.product.price} each
                        </p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-sm text-muted-foreground">Qty</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Rs. {item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>Rs. {order.totalAmount}</span>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Special Instructions:
                    </p>
                    <p className="text-sm text-blue-800">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer Info & Status */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.user.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{order.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{order.user.phone}</p>
                    </div>
                  </div>
                  {order.orderType === "pickup" && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Pickup Location
                        </p>
                        <p className="font-medium">
                          {order.orderTypeDisplay || "F-10 Markaz, Islamabad"}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.orderType === "delivery" && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Delivery Address
                        </p>
                        <p className="font-medium">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            {order.status !== "delivered" &&
              order.status !== "cancelled" &&
              order.status !== "collected" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Update Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Current Status
                      </label>
                      <Select
                        value={currentStatus}
                        onValueChange={(value) =>
                          setCurrentStatus(value as Order["status"])
                        }
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          {order.orderType === "pickup" && (
                            <>
                              <SelectItem value="ready">
                                {order.orderType === "pickup"
                                  ? "Ready for Pickup"
                                  : "Ready"}
                              </SelectItem>
                              <SelectItem value="collected">
                                Collected
                              </SelectItem>
                            </>
                          )}

                          {order.orderType !== "pickup" && (
                            <>
                              <SelectItem value="Out for Delivery">
                                Out for Delivery
                              </SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                            </>
                          )}

                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate(currentStatus)}
                      disabled={updating || currentStatus === order.status}
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
