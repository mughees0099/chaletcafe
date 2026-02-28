import { Suspense } from "react";
import OrderConfirmationContent from "./order-confirmation-content";
import MainLayout from "@/components/layout/main-layout";

export default function OrderConfirmationPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </MainLayout>
  );
}
