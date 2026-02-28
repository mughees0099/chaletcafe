"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChefHat,
  Clock,
  Coffee,
  CreditCard,
  Download,
  Eye,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface CustomerOrdersProps {
  customerId: string;
  data: any;
  customer: any;
}

const generatePDF = (order: any, user: any) => {
  const receiptWindow = window.open("", "_blank");
  if (!receiptWindow) return;

  console.log("Generating PDF for order:", order);

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Receipt - ${order.orderId}</title>
      <style>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 10px;
  background: #f9f9f9;
  font-size: 12px;
}
.receipt {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.header {
  text-align: center;
  border-bottom: 2px solid #dc2626;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.logo {
  font-size: 22px;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 3px;
}
.subtitle {
  color: #666;
  font-size: 11px;
}
.order-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}
.info-section {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #dc2626;
}
.info-section h3 {
  color: #333;
  font-size: 13px;
  margin: 0 0 8px 0;
  font-weight: 600;
}
.info-item {
  margin-bottom: 6px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-label {
  color: #666;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.info-value {
  color: #333;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  word-wrap: break-word;
  font-size: 11px;
}
.address-section {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #dc2626;
  margin-bottom: 15px;
}
.address-section h3 {
  color: #333;
  font-size: 13px;
  margin: 0 0 5px 0;
  font-weight: 600;
}
.address-value {
  color: #333;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.3;
  word-wrap: break-word;
}
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 11px;
}
.items-table th,
.items-table td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.items-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.total-section {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  border-top: 2px solid #dc2626;
}
.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 11px;
  padding: 2px 0;
}
.total-final {
  font-size: 14px;
  font-weight: bold;
  color: #dc2626;
  border-top: 1px solid #dc2626;
  padding-top: 8px;
  margin-top: 8px;
}
.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.status-pending { background: #fef3c7; color: #92400e; }
.status-preparing { background: #fed7aa; color: #c2410c; }
.status-ready { background: #dcfce7; color: #166534; }
.status-delivered { background: #dbeafe; color: #1d4ed8; }
.status-cancelled { background: #fecaca; color: #dc2626; }
.footer {
  text-align: center;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 9px;
  line-height: 1.4;
}
.footer p {
  margin: 3px 0;
}

@media print {
  body { 
    background: white; 
    padding: 0;
    margin: 0;
    font-size: 11px;
  }
  .receipt { 
    box-shadow: none; 
    max-width: none;
    padding: 10px;
    margin: 0;
    page-break-inside: avoid;
  }
  .info-section, .address-section, .total-section {
    background: #f8f9fa !important;
    -webkit-print-color-adjust: exact;
    page-break-inside: avoid;
  }
  .items-table {
    page-break-inside: avoid;
  }
  .header {
    page-break-after: avoid;
  }
  .footer {
    page-break-before: avoid;
  }
  @page {
    margin: 0.5in;
    size: A4;
  }
}
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">☕ Chalet Cafe</div>
          <div class="subtitle">Premium Coffee & Delicious Treats</div>
        </div>
        
        
<div class="order-info">
  <div class="info-section">
    <h3>📋 Order Details</h3>
    <div class="info-item">
      <span class="info-label">Order ID</span>
      <span class="info-value">${order.orderId}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Date</span>
      <span class="info-value">${new Date(order.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }
      )}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Time</span>
      <span class="info-value">${new Date(order.createdAt).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Status</span>
      <span class="status-badge status-${order.status}">${order.status}</span>
    </div>
  </div>
  
  <div class="info-section">
    <h3>👤 Customer</h3>
    <div class="info-item">
      <span class="info-label">Name</span>
      <span class="info-value">${user.name}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Email</span>
      <span class="info-value">${user.email}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Phone</span>
      <span class="info-value">${user.phone || "N/A"}</span>
    </div>
  </div>
</div>

<div class="address-section">
  <h3>📍 ${
    order.orderType === "pickup" ? "Pickup Location" : "Delivery Address"
  }</h3>
  <div class="address-value">${
    order.orderType === "pickup"
      ? "Main Nazim-ud-din Road F-7/1, Opposite Islamabad Stock Exchange Tower, Islamabad, Pakistan 44000."
      : order.deliveryAddress
  }</div>
</div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (item: any) => `
              <tr>
                <td><strong>${item.product.name}</strong></td>
                <td>${item.quantity}</td>
                <td>RS. ${item.product.price}</td>
                <td><strong>RS. ${(item.product.price * item.quantity).toFixed(
                  2
                )}</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>RS. ${
              order.orderType
                ? order.totalAmount
                : (order.totalAmount - 150).toFixed(2)
            }</span>
          </div>
          <div class="total-row">
            <span>Tax (0%):</span>
            <span>RS. 0.00</span>
          </div>
          <div class="total-row">
            <span>Delivery Fee:</span>
            <span>RS. ${order.orderType ? "0.00" : "150"}</span>
          </div>
          <div class="total-row total-final">
            <span>Total Amount:</span>
            <span>RS. ${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing Chalet Cafe! ☕</strong></p>
          <p>For any queries, contact us at <strong>info@chaletcafe.com</strong> | <strong>+92-07817 617782</strong></p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
};

export default function CustomerOrders({
  customerId,
  data,
  customer,
}: CustomerOrdersProps) {
  // Filter orders for this specific customer
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <CheckCircle className="h-4 w-4" />;
      case "preparing":
        return <ChefHat className="h-4 w-4" />;
      case "ready":
        return <Package className="h-4 w-4" />;
      case "Out for Delivery":
        return <Truck className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "collected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailDialog(true);
  };

  const handleDownloadReceipt = (order: any) => {
    generatePDF(order, customer);
  };

  const OrderDetailModal = () => (
    <Dialog open={orderDetailDialog} onOpenChange={setOrderDetailDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-red-600" />
            </div>
            Order Details - {selectedOrder?.orderId}
          </DialogTitle>
          <DialogDescription>
            Complete information about order
          </DialogDescription>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Order Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Current Status:
                        </span>
                        <Badge
                          className={`${
                            selectedOrder.status === "pending"
                              ? "text-yellow-600 bg-yellow-100"
                              : selectedOrder.status === "preparing"
                              ? "text-orange-600 bg-orange-100"
                              : selectedOrder.status === "ready"
                              ? "text-blue-600 bg-blue-100"
                              : selectedOrder.status === "delivered"
                              ? "text-green-600 bg-green-100 "
                              : selectedOrder.status === "cancelled"
                              ? "text-red-600 bg-red-100 "
                              : selectedOrder.status === "Out for Delivery"
                              ? "text-purple-600 bg-purple-100"
                              : selectedOrder.status === "collected"
                              ? "text-green-600 bg-green-100 "
                              : "text-gray-600 bg-gray-100"
                          } font-medium`}
                        >
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            Order Progress
                          </h4>
                          <span className="text-sm font-medium text-gray-600">
                            {selectedOrder.status === "pending"
                              ? 0
                              : selectedOrder.status === "preparing"
                              ? 40
                              : selectedOrder.status === "ready"
                              ? 80
                              : selectedOrder.status === "Out for Delivery"
                              ? 90
                              : selectedOrder.status === "delivered" ||
                                selectedOrder.status === "collected"
                              ? 100
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-primary/90 rounded-full transition-all duration-700 ease-in-out"
                            style={{
                              width:
                                selectedOrder.status === "pending"
                                  ? "0%"
                                  : selectedOrder.status === "preparing"
                                  ? "40%"
                                  : selectedOrder.status === "ready"
                                  ? "80%"
                                  : selectedOrder.status === "Out for Delivery"
                                  ? "90%"
                                  : selectedOrder.status === "delivered" ||
                                    selectedOrder.status === "collected"
                                  ? "100%"
                                  : "0%",
                            }}
                          ></div>
                          <div className="absolute inset-0 overflow-hidden rounded-full">
                            <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">
                          {selectedOrder.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="font-medium">
                          {selectedOrder.status === "pending"
                            ? "Waiting for approval"
                            : selectedOrder.status === "preparing"
                            ? "30 - 45 mins"
                            : selectedOrder.status === "ready"
                            ? "Ready"
                            : selectedOrder.status === "Out for Delivery"
                            ? "10 - 15 mins (on the way)"
                            : selectedOrder.status === "delivered"
                            ? "Delivered"
                            : selectedOrder.status === "collected"
                            ? "Collected"
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items ({selectedOrder.products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.products.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center border">
                          <Coffee className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            RS. {item.product.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          RS. {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      RS. {selectedOrder.totalAmount - 150}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">RS. 0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">RS. 150</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-red-600">
                      RS. {selectedOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setOrderDetailDialog(false)}>
            Close
          </Button>
          {selectedOrder &&
            (selectedOrder.status === "delivered" ||
              selectedOrder.status === "collected") && (
              <Button
                onClick={() => handleDownloadReceipt(selectedOrder)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const customerOrders =
    data?.orders?.filter((order: any) => order.user._id === customerId) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200 bg-orange-50"
          >
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="text-blue-600 border-blue-200 bg-blue-50"
          >
            Processing
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            Delivered
          </Badge>
        );
      case "collected":
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            Collected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "card":
        return "Credit/Debit Card";
      case "easypaisa":
        return "Easypaisa";
      case "jazzcash":
        return "JazzCash";
      default:
        return method;
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.map((order: any) => (
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.products.length}</TableCell>
                    <TableCell className="font-semibold">
                      Rs. {order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodDisplay(order.paymentMethod)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-50"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {customerOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No orders found for this customer
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <OrderDetailModal />
    </>
  );
}
