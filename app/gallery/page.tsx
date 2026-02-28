import MainLayout from "@/components/layout/main-layout";
import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery | Chalet Cafe Islamabad",
  description: "Explore photos of our cafe, food, and events",
};

export default function GalleryPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Gallery</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Take a visual tour of our cafe & Signature food.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <GalleryGrid />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
