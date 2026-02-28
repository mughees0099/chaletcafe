"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerOrders from "@/components/admin/customers/customer-orders";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Banknote,
  ShoppingBag,
  BarChart3,
  Package,
  Clock,
  Coffee,
  CreditCard,
  Download,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CustomerDetailsDialogProps {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    orders: number;
    spent: number;
    status: string;
  };
  data: any;
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
  <h3>📍 Delivery Address</h3>
  <div class="address-value">${order.deliveryAddress}</div>
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
            <span>RS. ${(order.totalAmount - 150).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax (0%):</span>
            <span>RS. 0.00</span>
          </div>
          <div class="total-row">
            <span>Delivery Fee:</span>
            <span>RS. 150.00</span>
          </div>
          <div class="total-row total-final">
            <span>Total Amount:</span>
            <span>RS. ${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing Chalet Cafe! ☕</strong></p>
          <p>For any queries, contact us at <strong>info@chaletcafe.com</strong> | <strong>+92-XXX-XXXXXXX</strong></p>
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

export default function CustomerDetailsDialog({
  customerId,
  isOpen,
  onClose,
  customer,
  data,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const customerOrders =
    data?.orders?.filter((order: any) => order.user._id === customerId) || [];

  const lastOrder = customerOrders.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const avgOrderValue =
    customer.orders > 0 ? customer.spent / customer.orders : 0;

  const mostOrderedItem =
    customerOrders.length > 0
      ? customerOrders[0].products[0]?.product.name || "N/A"
      : "N/A";

  const addresses = [
    {
      id: 1,
      type: "Last Order Address",
      address: lastOrder?.deliveryAddress || "No address available",

      isDefault: true,
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold">
              Customer Details
            </DialogTitle>
            <DialogDescription className="text-base">
              View comprehensive information about this customer
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage
                      // src={`/placeholder.svg?height=96&width=96`}
                      alt={customer.name}
                    />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{customer.name}</CardTitle>
                  <Badge
                    variant={
                      customer.status === "active"
                        ? "default"
                        : customer.status === "blocked"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mt-2 fex items-center justify-center bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Contact Info
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm">
                          Joined {formatDate(customer.joinDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="p-2 bg-blue-600 rounded-lg w-fit mx-auto mb-2">
                        <ShoppingBag className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {customer.orders}
                      </div>
                      <div className="text-xs text-blue-600">Orders</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                      <div className="p-2 bg-emerald-600 rounded-lg w-fit mx-auto mb-2">
                        <Banknote className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-900">
                        Rs. {customer.spent.toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-600">
                        Total Spent
                      </div>
                    </div>
                  </div>
                  {/* Addresses */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Addresses
                    </h4>
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">
                              {address.type}
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <p>{address.address}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Customer Details Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="orders"
                    className="flex items-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Order History</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Statistics</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orders" className="space-y-4">
                  <CustomerOrders
                    customerId={customerId}
                    customer={customer}
                    data={data}
                  />
                </TabsContent>
                <TabsContent value="stats">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Customer Analytics</CardTitle>
                      <CardDescription>
                        Detailed insights about this customer's behavior
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                            <p className="text-sm text-amber-700 font-medium">
                              Average Order Value
                            </p>
                            <p className="text-2xl font-bold text-amber-900">
                              Rs. {Math.round(avgOrderValue).toLocaleString()}
                            </p>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                            <p className="text-sm text-purple-700 font-medium">
                              Last Order Date
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                              {lastOrder
                                ? new Date(
                                    lastOrder.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg">
                            <p className="text-sm text-rose-700 font-medium">
                              Most Ordered Item
                            </p>
                            <p className="text-lg font-semibold text-rose-900">
                              {mostOrderedItem}
                            </p>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                            <p className="text-sm text-indigo-700 font-medium">
                              Favorite Category
                            </p>
                            <p className="text-lg font-semibold text-indigo-900">
                              {customer.orders > 0 ? "Food & Beverages" : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter className="flex justify-between pt-6">
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
