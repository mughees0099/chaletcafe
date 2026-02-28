"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderId: string;
}

interface AdminSalesChartProps {
  orders: Order[];
}

export default function AdminSalesChart({ orders = [] }: AdminSalesChartProps) {
  const salesData = useMemo(() => {
    const today = new Date();

    const currentDay = today.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDays.push(date);
    }

    const dailySales = weekDays.map((date) => {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const dayName = dayNames[dayIndex];
      const dateStr = date.toISOString().split("T")[0];

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return (
          orderDate === dateStr &&
          (order.status === "delivered" || order.status === "collected")
        );
      });

      const totalSales = dayOrders.reduce((sum, order) => {
        return sum + order.totalAmount;
      }, 0);

      return {
        day: dayName,
        sales: totalSales,
        date: dateStr,
        orderCount: dayOrders.length,
        fullDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    return dailySales;
  }, [orders]);

  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
    <div className="h-72">
      <ChartContainer
        config={{
          sales: {
            label: "Daily Sales (PKR)",
            color: "#4CA88A",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 12 }} />
            <YAxis
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value >= 1000
                  ? `${(value / 1000).toFixed(0)}k`
                  : value.toString()
              }
              domain={[0, maxSales > 0 ? maxSales * 1.1 : 1000]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value, name, props) => [
                `Rs. ${Number(value).toLocaleString()}`,
                "Sales",
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${label} (${data.fullDate}) - ${data.orderCount} delivered orders`;
                }
                return label;
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--color-sales)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-sales)" }}
              activeDot={{ r: 6, fill: "var(--color-sales)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
