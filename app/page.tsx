import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";
import HeroSection from "@/components/home/hero-section";
import FeaturedMenu from "@/components/home/featured-menu";
import AboutSection from "@/components/home/about-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import SpecialOffers from "@/components/home/special-offers";
import InstagramFeed from "@/components/home/instagram-feed";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedMenu />
      <AboutSection />
      <SpecialOffers />
      <section className="bg-secondary py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
            Ready to Order?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Experience the convenience of ordering your favorite Chalet Cafe
            items online. Fast delivery, easy payment options, and the same
            great taste you love.
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Our Menu <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      <TestimonialsSection />
      <InstagramFeed />
    </MainLayout>
  );
}
