"use client";

import { useEffect, useState } from "react";
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
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import { OrderDetailsDialog } from "./order-details-dialog";
import AdminOrdersFilter from "./admin-orders-filter";
import axios from "axios";
import type { DateRange } from "react-day-picker";

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
    | "Out for Delivery"
    | "collected";
  createdAt: string;
  updatedAt: string;
};

export default function AdminOrdersFullTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: keyof Order; dir: "asc" | "desc" }>({
    key: "createdAt",
    dir: "desc",
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/orders");
        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }
        setOrders(response.data);
        setFilteredOrders(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (filters: {
    search: string;
    status: string;
    dateRange: DateRange | undefined;
  }) => {
    let filtered = [...orders];

    if (filters.search.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.user.name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          order.user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);

        const startDate = new Date(filters.dateRange.from!);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filters.dateRange.to!);
        endDate.setHours(23, 59, 59, 999);

        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    console.log("Applied filters:", filters);
    console.log("Filtered results:", filtered.length);
    setFilteredOrders(filtered);
  };

  const toggleSort = (key: keyof Order) =>
    setSort((p) =>
      p.key === key
        ? { key, dir: p.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal: any = a[sort.key];
    let bVal: any = b[sort.key];

    if (sort.key === "user") {
      aVal = a.user.name;
      bVal = b.user.name;
    }

    if (aVal === bVal) return 0;
    return sort.dir === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  const badge = (status: Order["status"]) => {
    const cls = "rounded-sm px-2 py-px text-xs font-medium";
    switch (status) {
      case "pending":
        return (
          <Badge className={`${cls} bg-orange-50 text-orange-700`}>
            Pending
          </Badge>
        );
      case "preparing":
        return (
          <Badge className={`${cls} bg-blue-50 text-blue-700`}>Preparing</Badge>
        );
      case "ready":
        return (
          <Badge className={`${cls} bg-purple-50 text-purple-700`}>Ready</Badge>
        );
      case "Out for Delivery":
        return (
          <Badge className={`${cls} bg-yellow-50 text-yellow-700`}>
            Out for Delivery
          </Badge>
        );
      case "collected":
        return (
          <Badge className={`${cls} bg-gray-50 text-gray-700`}>Collected</Badge>
        );
      case "delivered":
        return (
          <Badge className={`${cls} bg-green-50 text-green-700`}>
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className={`${cls} bg-red-50 text-red-700`}>Cancelled</Badge>
        );
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const getTotalItems = (products: Order["products"]) => {
    return products.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Component */}
      <AdminOrdersFilter orders={orders} onFilterChange={handleFilterChange} />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedOrders.length}</strong> of{" "}
          <strong>{orders.length}</strong> orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead
                onClick={() => toggleSort("orderId")}
                className="cursor-pointer select-none font-semibold"
              >
                <span className="flex items-center gap-1">
                  Order ID
                  {sort.key === "orderId" &&
                    (sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("user")}
                className="cursor-pointer select-none font-semibold"
              >
                <span className="flex items-center gap-1">
                  Customer
                  {sort.key === "user" &&
                    (sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("createdAt")}
                className="cursor-pointer select-none font-semibold"
              >
                <span className="flex items-center gap-1">
                  Date
                  {sort.key === "createdAt" &&
                    (sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead
                onClick={() => toggleSort("totalAmount")}
                className="cursor-pointer select-none font-semibold"
              >
                <span className="flex items-center gap-1">
                  Total
                  {sort.key === "totalAmount" &&
                    (sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("paymentMethod")}
                className="cursor-pointer select-none font-semibold"
              >
                <span className="flex items-center gap-1">
                  Payment
                  {sort.key === "paymentMethod" &&
                    (sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </TableHead>
              <TableHead
                onClick={() => toggleSort("status")}
                className="cursor-pointer select-none font-semibold"
              >
                <span className="flex items-center gap-1">
                  Status
                  {sort.key === "status" &&
                    (sort.dir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{fmtDate(order.createdAt)}</TableCell>
                <TableCell>{getTotalItems(order.products)}</TableCell>
                <TableCell className="font-semibold">
                  Rs. {order.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell className="capitalize">
                  {order.orderType === "pickup" ? "COP" : order.paymentMethod}
                </TableCell>
                <TableCell>{badge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-blue-50"
                    onClick={() => handleViewOrder(order._id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* pagination placeholder */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedOrders.length}</strong> orders
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Order Details Dialog */}
      {selectedOrderId && (
        <OrderDetailsDialog
          orderId={selectedOrderId}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          orders={orders}
        />
      )}
    </div>
  );
}
