"use client";
import CustomersTable from "@/components/admin/customers/customers-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerStats from "@/components/admin/customers/customer-stats";
import { useState } from "react";

export default function AdminCustomersPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    avgOrderValue: 0,
  });
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Customer Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your customer accounts and view customer information
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomerStats
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
        />
        <CustomerStats
          title="New Customers"
          value={stats.newCustomers.toLocaleString()}
        />
        <CustomerStats
          title="Avg. Order Value"
          value={`RS. ${stats.avgOrderValue.toFixed(0)}`}
        />
      </div>
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">
            Customer Management
          </CardTitle>
          <CardDescription className="text-base">
            View and manage all customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <CustomersTable setStats={setStats} />
        </CardContent>
      </Card>
    </div>
  );
}
