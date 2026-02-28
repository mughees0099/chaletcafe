"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "react-toastify";

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

interface AdminOrdersFilterProps {
  orders: Order[];
  onFilterChange: (filters: {
    search: string;
    status: string;
    dateRange: DateRange | undefined;
  }) => void;
}

export default function AdminOrdersFilter({
  orders,
  onFilterChange,
}: AdminOrdersFilterProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status, dateRange });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value, dateRange });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange({ search, status, dateRange: range });
  };

  const generatePDF = () => {
    let filteredOrders = orders.filter(
      (order) => order.status === "delivered" || order.status === "collected"
    );

    if (dateRange?.from && dateRange?.to) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);

        const startDate = new Date(dateRange.from!);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateRange.to!);
        endDate.setHours(23, 59, 59, 999);

        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (search.trim()) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          order.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filteredOrders.length === 0) {
      toast.info(
        "No delivered or collected orders found for the selected criteria. Please check your filters."
      );
      return;
    }

    const totalAmount = filteredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dateRangeText =
      dateRange?.from && dateRange?.to
        ? `${format(dateRange.from, "dd MMM yyyy")} to ${format(
            dateRange.to,
            "dd MMM yyyy"
          )}`
        : "All Time";

    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Delivered Orders Summary - ${dateRangeText}</title>
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
             margin-bottom: 30px;
          }
          .cafe-name {
             font-size: 32px;
             font-weight: bold;
             color: #2563eb;
             margin-bottom: 5px;
          }
          .cafe-info {
             font-size: 14px;
             color: #666;
             margin-bottom: 10px;
          }
          .report-title {
             font-size: 24px;
             font-weight: bold;
             color: #333;
             margin-top: 15px;
          }
          .date-range {
             font-size: 16px;
             color: #666;
             margin-top: 5px;
          }
          .summary-stats {
             display: flex;
             justify-content: space-between;
             margin-bottom: 30px;
             background-color: #f8f9fa;
             padding: 20px;
             border-radius: 8px;
          }
          .stat-item {
             text-align: center;
          }
          .stat-number {
             font-size: 28px;
             font-weight: bold;
             color: #2563eb;
          }
          .stat-label {
             font-size: 14px;
             color: #666;
             margin-top: 5px;
          }
          .orders-table {
             width: 100%;
             border-collapse: collapse;
             margin-bottom: 30px;
          }
          .orders-table th, .orders-table td {
             border: 1px solid #ddd;
             padding: 12px;
             text-align: left;
          }
          .orders-table th {
             background-color: #f5f5f5;
             font-weight: bold;
             color: #333;
          }
          .orders-table tr:nth-child(even) {
             background-color: #f9f9f9;
          }
          .total-section {
             text-align: right;
             margin-top: 30px;
             padding: 20px;
             background-color: #e3f2fd;
             border-radius: 8px;
          }
          .grand-total {
             font-size: 24px;
             font-weight: bold;
             color: #1976d2;
          }
          .footer {
             text-align: center;
             margin-top: 40px;
             font-size: 12px;
             color: #666;
             border-top: 1px solid #ddd;
             padding-top: 20px;
          }
          .no-data {
             text-align: center;
             padding: 40px;
             color: #666;
             font-style: italic;
          }
          @media print {
            body { margin: 0; }
            .summary-stats { display: block; }
            .stat-item { display: inline-block; margin-right: 30px; }
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
          <div class="report-title">Delivered Orders Summary</div>
          <div class="date-range">Period: ${dateRangeText}</div>
        </div>

        <div class="summary-stats">
          <div class="stat-item">
            <div class="stat-number">${filteredOrders.length}</div>
            <div class="stat-label">Total Orders</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">Rs. ${totalAmount.toLocaleString()}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">Rs. ${
              filteredOrders.length > 0
                ? Math.round(
                    totalAmount / filteredOrders.length
                  ).toLocaleString()
                : 0
            }</div>
            <div class="stat-label">Average Order</div>
          </div>
        </div>

        ${
          filteredOrders.length > 0
            ? `
        <table class="orders-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Payment Method</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map(
                (order) => `
              <tr>
                <td>${new Intl.DateTimeFormat("en-PK", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(order.createdAt))}</td>
                <td>${order.orderId}</td>
                <td>${order.user.name}</td>
                <td>${
                  order.orderType ? "COP" : order.paymentMethod.toUpperCase()
                }</td>
                <td>Rs. ${order.totalAmount.toLocaleString()}</td>
              </tr>
              ${console.log(order)}
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-section">
          <div class="grand-total">
            Grand Total: Rs. ${totalAmount.toLocaleString()}
          </div>
        </div>
        `
            : `
        <div class="no-data">
          <h3>No delivered orders found for the selected period</h3>
          <p>Please try selecting a different date range or check if there are any delivered orders in your system.</p>
        </div>
        `
        }

        <div class="footer">
          Generated on ${new Date().toLocaleDateString("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}<br>
          This report contains ${filteredOrders.length} delivered orders
        </div>
      </body>
    </html>
  `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Status Filter */}
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full lg:w-48 h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full lg:w-64 h-11 bg-gray-50 border-0 focus:bg-white hover:bg-white justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={() => onFilterChange({ search, status, dateRange })}
              className="h-11 bg-blue-600 hover:bg-blue-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button
              onClick={generatePDF}
              variant="outline"
              className="h-11 bg-transparent hover:bg-gray-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(search || status !== "all" || dateRange?.from) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {search && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                Search: "{search}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {status !== "all" && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                Status: {status}
                <button
                  onClick={() => handleStatusChange("all")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            )}
            {dateRange?.from && (
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                Date: {format(dateRange.from, "MMM dd")} -{" "}
                {dateRange.to ? format(dateRange.to, "MMM dd") : "..."}
                <button
                  onClick={() => handleDateRangeChange(undefined)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
