"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import CustomerDetailsDialog from "@/components/admin/customers/customer-details-dialog";
import { Search, MoreHorizontal, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface TransformedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  spent: number;
  status: string;
}

export default function CustomersTable({ setStats }: any) {
  const [data, setData] = useState<any>({});
  const [customers, setCustomers] = useState<TransformedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/dashboard");
        if (response.status === 200) {
          setData(response.data);

          const transformedCustomers = response.data.customers.map(
            (customer: any) => {
              const customerOrders = response.data.orders.filter(
                (order: any) => order.user._id === customer._id
              );

              const totalSpent = customerOrders
                .filter(
                  (order: any) =>
                    order.status === "delivered" || order.status === "collected"
                )
                .reduce(
                  (sum: number, order: any) => sum + order.totalAmount,
                  0
                );

              const joinDate =
                customerOrders.length > 0
                  ? customerOrders.sort(
                      (a: any, b: any) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )[0].createdAt
                  : new Date().toISOString();

              const hasRecentOrders = customerOrders.some(
                (order: any) =>
                  new Date(order.createdAt).getTime() >
                  Date.now() - 30 * 24 * 60 * 60 * 1000
              );

              return {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                joinDate,
                orders: customerOrders.length,
                spent: totalSpent,
                status: hasRecentOrders ? "active" : "inactive",
              };
            }
          );

          setCustomers(transformedCustomers);
          setStats({
            totalCustomers: transformedCustomers.length,
            newCustomers: transformedCustomers.filter(
              (customer) =>
                new Date(customer.joinDate).getTime() >
                Date.now() - 30 * 24 * 60 * 60 * 1000
            ).length,
            avgOrderValue:
              transformedCustomers.reduce(
                (sum, customer) => sum + customer.spent,
                0
              ) / Math.max(transformedCustomers.length, 1),
          });
        } else {
          toast.error("Failed to fetch customer data. Please try again later.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching customer data.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    fetchData();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleViewDetails = (customerId: string) => {
    setSelectedCustomer(customerId);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Getting Customer Information...</span>
      </div>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                className="pl-10 h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="text-right font-semibold">
                    Orders
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Total Spent
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{customer.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {customer.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(customer.joinDate)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {customer.orders}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      Rs. {customer.spent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.status === "active"
                            ? "default"
                            : customer.status === "blocked"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          customer.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : customer.status === "blocked"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(customer.id)}
                        className="hover:bg-blue-50"
                        aria-label="View customer details"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No customers found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredCustomers.length}</strong> of{" "}
              <strong>{customers.length}</strong> customers
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedCustomer && (
        <CustomerDetailsDialog
          customerId={selectedCustomer}
          isOpen={selectedCustomer !== null}
          onClose={handleCloseDetails}
          customer={getCustomerById(selectedCustomer)}
          data={data}
        />
      )}
    </>
  );
}
