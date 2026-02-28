"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function SpecialOffers() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
            Special Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take advantage of our limited-time promotions and seasonal specials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
            <img
              src="/menu/Snack combo.jpg?height=400&width=600"
              alt="Breakfast Special"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Snack Special</h3>
              <p className="mb-4">
                Enjoy 20% off on all snack items from Monday to Friday, 5:00 PM
                to 11:00 PM.
              </p>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-2" />
                <span>Limited Time Offer</span>
              </div>
              <Link href="/menu">
                <Button className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                  Order Now
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
            <img
              src="/menu/Smoked chicken.jpg?height=400&width=600"
              alt="Coffee Bundle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Pizza Special</h3>
              <p className="mb-4">
                Get any Pizza and dessert combo for just Rs. 900. Perfect for
                your afternoon treat!
              </p>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-2" />
                <span>Available Daily</span>
              </div>
              <Link href="/menu">
                <Button className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                  Order Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
