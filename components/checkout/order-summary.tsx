// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useCart } from "@/components/cart/cart-provider";

// export default function OrderSummary() {
//   const { cartItems, totalPrice } = useCart();
//   const [mounted, setMounted] = useState(false);

//   // Handle hydration mismatch
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const deliveryFee = 150;
//   const total = totalPrice + deliveryFee;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Order Summary</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {cartItems.length === 0 ? (
//             <p className="text-center text-gray-500 py-4">Your cart is empty</p>
//           ) : (
//             <>
//               <div className="space-y-3">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="flex justify-between">
//                     <div className="flex-1">
//                       <p className="font-medium">
//                         {item.name}{" "}
//                         <span className="text-gray-500">x{item.quantity}</span>
//                       </p>
//                     </div>
//                     <p className="font-medium">
//                       Rs. {item.price * item.quantity}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Subtotal</span>
//                   <span>Rs. {totalPrice}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Delivery Fee</span>
//                   <span>Rs. {deliveryFee}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Tax</span>
//                   <span>Included</span>
//                 </div>
//               </div>

//               <Separator />

//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>Rs. {total}</span>
//               </div>
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";

interface OrderSummaryProps {
  orderType: "delivery" | "pickup";
}

export default function OrderSummary({ orderType }: OrderSummaryProps) {
  const { cartItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const deliveryFee = orderType === "delivery" ? 150 : 0;
  const total = totalPrice + deliveryFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.name}{" "}
                        <span className="text-gray-500">x{item.quantity}</span>
                      </p>
                    </div>
                    <p className="font-medium">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>Rs. {totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {orderType === "delivery" ? "Delivery Fee" : "Pickup Fee"}
                  </span>
                  <span
                    className={orderType === "pickup" ? "text-green-600" : ""}
                  >
                    {orderType === "delivery" ? `Rs. ${deliveryFee}` : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>Included</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
              {orderType === "pickup" && (
                <div className="text-center text-sm text-green-600 font-medium">
                  You saved Rs. 150 on delivery!
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
