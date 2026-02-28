// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, Home, ShoppingBag } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function OrderConfirmationContent() {
//   const searchParams = useSearchParams();
//   const orderIdFromParams = searchParams.get("orderId");
//   const [item, setItem] = useState({
//     orderId: "",
//     status: "",
//     paymentMethod: "",
//     totalAmount: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     if (orderIdFromParams) {
//       async function fetchOrder() {
//         try {
//           setLoading(true);
//           const response = await axios.get(`/api/orders/${orderIdFromParams}`);
//           if (response.status === 200) {
//             setItem(response.data);
//           } else {
//             setError(true);
//             toast.error("Order not found. Please check your order ID.");
//           }
//         } catch (error) {
//           setError(true);
//           toast.error("Failed to fetch order. Please try again later.");
//         } finally {
//           setLoading(false);
//         }
//       }
//       fetchOrder();
//     }
//   }, [orderIdFromParams]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error || !item.orderId) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
//           <p className="text-gray-600 mb-4">
//             We couldn't find your order. Please check your order ID and try
//             again.
//           </p>
//           <Link href="/">
//             <Button variant="outline" className="bg-primary/90 text-white">
//               Back to Home
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-24 pb-16 bg-secondary">
//       <div className="container mx-auto px-4 max-w-3xl">
//         <Card className="border-none shadow-lg">
//           <CardContent className="pt-6 px-6 pb-8">
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                 <CheckCircle className="h-10 w-10 text-green-600" />
//               </div>
//               <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
//               <p className="text-gray-600 mb-2">
//                 Thank you for your order. We've received your order and will
//                 begin processing it right away.
//               </p>
//               <p className="text-primary font-medium">
//                 Order ID: {item.orderId}
//               </p>
//             </div>
//             <div className="bg-secondary p-6 rounded-lg mb-6">
//               <h2 className="text-lg font-semibold mb-4">Order Details</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Order Status:</span>
//                   <span className="font-medium">{item.status}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Estimated Delivery:</span>
//                   <span className="font-medium">30-45 minutes</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Method:</span>
//                   <span className="font-medium">
//                     {item.paymentMethod === "cod" ? "Cash On Delivery" : "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Amount:</span>
//                   <span className="font-medium">
//                     Rs. {item.totalAmount - 150}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Delivery Fee:</span>
//                   <span className="font-medium">Rs. 150</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Sub Total:</span>
//                   <span className="font-medium">Rs. {item.totalAmount}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="text-center space-y-4">
//               <p className="text-gray-600">
//                 You can track your order status in your account dashboard.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link href="/dashboard">
//                   <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
//                     <ShoppingBag className="mr-2 h-4 w-4" /> Track Order
//                   </Button>
//                 </Link>
//                 <Link href="/">
//                   <Button
//                     variant="outline"
//                     className="w-full sm:w-auto bg-transparent"
//                   >
//                     <Home className="mr-2 h-4 w-4" /> Back to Home
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Home,
  ShoppingBag,
  MapPin,
  Truck,
  Clock,
  Phone,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface OrderItem {
  orderId: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  orderType: "delivery" | "pickup";
  deliveryAddress?: string;
  pickupBranch?: {
    branchId: string;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
  };
  estimatedTime?: string;
  createdAt: string;
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderIdFromParams = searchParams.get("orderId");
  const [item, setItem] = useState<OrderItem>({
    orderId: "",
    status: "",
    paymentMethod: "",
    totalAmount: 0,
    orderType: "delivery",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (orderIdFromParams) {
      async function fetchOrder() {
        try {
          setLoading(true);
          const response = await axios.get(`/api/orders/${orderIdFromParams}`);
          if (response.status === 200) {
            setItem(response.data);
          } else {
            setError(true);
            toast.error("Order not found. Please check your order ID.");
          }
        } catch (error) {
          setError(true);
          toast.error("Failed to fetch order. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
  }, [orderIdFromParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item.orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">
            We couldn't find your order. Please check your order ID and try
            again.
          </p>
          <Link href="/">
            <Button variant="outline" className="bg-primary/90 text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isDelivery = item.orderType === "delivery";
  const deliveryFee = isDelivery ? 150 : 0;
  const subtotal = item.totalAmount - deliveryFee;

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "Pending Confirmation",
      confirmed: "Confirmed",
      preparing: "Being Prepared",
      ready: isDelivery ? "Ready" : "Ready for Pickup",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      collected: "Collected",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const getEstimatedTime = () => {
    if (item.estimatedTime) {
      return new Date(item.estimatedTime).toLocaleString();
    }
    return isDelivery ? "30-45 minutes" : "20-30 minutes";
  };

  return (
    <div className="pt-24 pb-16 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="border-none shadow-lg">
          <CardContent className="pt-6 px-6 pb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {isDelivery ? "🚚" : "🏪"} Order Confirmed!
              </h1>
              <p className="text-gray-600 mb-2">
                Thank you for your {isDelivery ? "delivery" : "pickup"} order.
                We've received your order and will begin processing it right
                away.
              </p>
              <p className="text-primary font-medium">
                Order ID: {item.orderId}
              </p>
            </div>

            {/* Order Type Banner */}
            <div
              className={`p-4 rounded-lg mb-6 border-l-4 ${
                isDelivery
                  ? "bg-blue-50 border-blue-400 text-blue-800"
                  : "bg-green-50 border-green-400 text-green-800"
              }`}
            >
              <div className="flex items-center">
                {isDelivery ? (
                  <Truck className="h-5 w-5 mr-2" />
                ) : (
                  <MapPin className="h-5 w-5 mr-2" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {isDelivery ? "Home Delivery Order" : "Store Pickup Order"}
                  </p>
                  <p className="text-sm opacity-75">
                    {isDelivery
                      ? "Your order will be delivered to your address"
                      : "Please collect your order from the selected branch"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-secondary p-6 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {isDelivery ? "Delivery Address" : "Pickup Location"}
              </h2>
              {isDelivery ? (
                <p className="text-gray-700">{item.deliveryAddress}</p>
              ) : (
                item.pickupBranch && (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {item.pickupBranch.branchName}
                    </p>
                    <p className="text-gray-700">
                      {item.pickupBranch.branchAddress}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{item.pickupBranch.branchPhone}</span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Order Details */}
            <div className="bg-secondary p-6 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className="font-medium">
                    {getStatusDisplay(item.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Estimated {isDelivery ? "Delivery" : "Pickup"} Time:
                  </span>
                  <span className="font-medium">{getEstimatedTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {item.paymentMethod === "cod"
                      ? isDelivery
                        ? "Cash on Delivery"
                        : "Cash on Pickup"
                      : "Online Payment"}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {isDelivery ? "Delivery Fee:" : "Pickup Fee:"}
                    </span>
                    <span
                      className={`font-medium ${
                        !isDelivery ? "text-green-600" : ""
                      }`}
                    >
                      {isDelivery ? `Rs. ${deliveryFee}` : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span>Rs. {item.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Instructions */}
            {!isDelivery && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-yellow-800 mb-2">
                  📋 Pickup Instructions
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Please bring a valid ID when collecting your order</li>
                  <li>
                    • Mention your Order ID: <strong>{item.orderId}</strong>
                  </li>
                  <li>• We'll call you when your order is ready for pickup</li>
                  <li>
                    • Orders are held for 2 hours after ready notification
                  </li>
                </ul>
              </div>
            )}

            {/* Savings Message for Pickup */}
            {!isDelivery && (
              <div className="text-center bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-green-700 font-medium">
                  🎉 You saved Rs. 150 on delivery fees by choosing pickup!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                You can track your order status in your account dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Track Order
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <Home className="mr-2 h-4 w-4" /> Back to Home
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need help with your order?
              </p>
              <p className="text-sm text-gray-600">
                Contact us at{" "}
                <a
                  href="tel:+92-51-1234567"
                  className="text-primary hover:underline"
                >
                  +92-51-1234567
                </a>{" "}
                or{" "}
                <a
                  href="mailto:support@chaletcafe.com"
                  className="text-primary hover:underline"
                >
                  support@chaletcafe.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
