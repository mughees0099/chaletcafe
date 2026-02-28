import MainLayout from "@/components/layout/main-layout";
import CheckoutContent from "@/components/checkout/checkout-content";

export const metadata = {
  title: "Checkout | Chalet Cafe Islamabad",
  description: "Complete your order from Chalet Cafe",
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <div className="py-16 bg-secondary">
        <CheckoutContent />
      </div>
    </MainLayout>
  );
}
