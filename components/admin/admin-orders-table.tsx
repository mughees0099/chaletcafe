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
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, DollarSign, Hash } from "lucide-react";

export default function AdminOrdersTable({ data }: any) {
  console.log("data is", JSON.stringify(data));
  console.log(data);
  const orders = data?.orders?.length > 0 ? data.orders : [];
  const filteredOrders = orders.filter(
    (order: any) => order.status !== "cancelled" && order.status !== "delivered"
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-PK", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            className="bg-orange-50 text-orange-700 border-orange-200"
            variant="outline"
          >
            Pending
          </Badge>
        );
      case "preparing":
      case "making":
        return (
          <Badge
            className="bg-blue-50 text-blue-700 border-blue-200"
            variant="outline"
          >
            Preparing
          </Badge>
        );
      case "ready":
        return (
          <Badge
            className="bg-purple-50 text-purple-700 border-purple-200"
            variant="outline"
          >
            Ready
          </Badge>
        );
      case "out_for_delivery":
        return (
          <Badge
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
            variant="outline"
          >
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            className="bg-green-50 text-green-700 border-green-200"
            variant="outline"
          >
            Delivered
          </Badge>
        );
      case "collected":
        return (
          <Badge
            className="bg-green-50 text-green-700 border-green-200"
            variant="outline"
          >
            Collected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No active orders found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Total
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(0, 5).map((order: any) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {order.orderId}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {order.user.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    Rs. {order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order: any) => (
          <Card key={order._id} className="shadow-sm border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">
                    {order.orderId}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{order.user.name}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">
                    Rs. {order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
