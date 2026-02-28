import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminOrdersFullTable from "@/components/admin/admin-orders-full-table";

export default function AdminOrdersPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-muted-foreground text-lg">
          View and manage all customer orders
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4"></CardHeader>
        <CardContent className="pt-0">
          <AdminOrdersFullTable />
        </CardContent>
      </Card>
    </div>
  );
}
