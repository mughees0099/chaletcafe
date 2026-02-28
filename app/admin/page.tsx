"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  CurrencyIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import AdminOrdersTable from "@/components/admin/admin-orders-table";
import AdminSalesChart from "@/components/admin/admin-sales-chart";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminDashboardPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        const response = await axios.get("/api/admin/dashboard");
        if (response.status === 200) {
          setData(response.data);
        } else {
          toast.error(
            "Failed to fetch dashboard data. Please try again later."
          );
        }
      };
      fetchData();
    } catch (error) {
      toast.error("An error occurred while fetching dashboard data.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-gold/100" />
        <span className="ml-2">Getting Information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Chalet Cafe Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's what's happening with your cafe today.
          </p>
        </div>
        <Link href="/admin/orders">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            View All Orders
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Orders
            </CardTitle>
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {data.totalOrders}
            </div>
            <div className="flex items-center text-sm text-blue-600 mt-2"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Total Customers
            </CardTitle>
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">
              {data.totalCustomers}
            </div>
            <div className="flex items-center text-sm text-emerald-600 mt-2"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-amber-700">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-amber-600 rounded-lg">
              <CurrencyIcon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {data?.totalRevenue?.toLocaleString("en-PK", {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="flex items-center text-sm text-amber-600 mt-2"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-purple-700">
              Active Orders
            </CardTitle>
            <div className="p-2 bg-purple-600 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {data.totalPendingOrders ? data.totalPendingOrders : 0}
            </div>
            <div className="flex items-center text-sm text-purple-600 mt-2"></div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  You have{" "}
                  {data.totalPendingOrders
                    ? data.totalPendingOrders >= 5
                      ? 5
                      : data.totalPendingOrders
                    : 0}
                  {data.totalPendingOrders && data.totalPendingOrders > 1
                    ? " orders "
                    : " order "}
                  in progress
                </CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <AdminOrdersTable data={data} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Sales Overview
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Daily sales for the past week
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <AdminSalesChart orders={data.orders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
