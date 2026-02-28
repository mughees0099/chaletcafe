import { Card, CardContent } from "@/components/ui/card";

interface CustomerStatsProps {
  title: string;
  value: string;
}

export default function CustomerStats({ title, value }: CustomerStatsProps) {
  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 ${
        title === "Total Customers"
          ? "text-blue-900 bg-gradient-to-br from-blue-50 to-blue-100"
          : title === "New Customers"
          ? "text-green-900 bg-gradient-to-br from-green-50 to-green-100"
          : title === "Avg. Order Value"
          ? "text-yellow-900  bg-gradient-to-br from-yellow-50 to-yellow-100"
          : "text-gray-900"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3 ">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline justify-between">
            <p className={`text-3xl font-bold `}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
