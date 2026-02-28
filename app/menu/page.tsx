import MainLayout from "@/components/layout/main-layout";
import type { Metadata } from "next";
import { Suspense } from "react";
import DynamicMenuContent from "@/components/menu/dynamic-menu-content";

export const metadata: Metadata = {
  title: "Menu | Chalet Cafe Islamabad",
  description:
    "Explore our delicious menu of coffee, breakfast, lunch, and desserts",
};

export default function MenuPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 section-heading">
              Our Menu
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully crafted menu featuring premium coffee,
              delicious breakfast options, hearty lunch selections, and
              indulgent desserts
            </p>
          </div>
          <Suspense
            fallback={<div className="text-center">Loading menu...</div>}
          >
            <DynamicMenuContent />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}
