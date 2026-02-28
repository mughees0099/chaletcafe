"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "@/components/cart/cart-provider";
import { toast } from "react-toastify";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

interface MenuSectionProps {
  title: string;
  id: string;
  description: string;
  items: MenuItem[];
}

export default function MenuSection({
  title,
  id,
  description,
  items,
}: MenuSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { addToCart } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    // Only add to cart if item is available
    if (!item.available) {
      toast.error(`${item.name} is currently not available!`);
      return;
    }

    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section id={id} className="mb-16" ref={ref}>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 section-heading">
        {title}
      </h2>
      <p className="text-gray-600 mb-8">{description}</p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {items.map((item) => (
          <motion.div key={item._id} variants={itemVariants}>
            <Card
              className={`overflow-hidden hover:shadow-md transition-shadow duration-300 menu-item-hover ${
                !item.available ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row relative">
                  {/* Availability Status Banner */}
                  {!item.available && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-semibold py-1 px-2 z-10">
                      <span>Currently not available</span>
                    </div>
                  )}

                  <div className="sm:w-1/3 h-40 relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className={`w-full h-full object-cover ${
                        !item.available ? "grayscale" : ""
                      }`}
                    />
                    {/* Overlay for unavailable items */}
                    {!item.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    )}
                  </div>

                  <div
                    className={`sm:w-2/3 p-4 ${!item.available ? "pt-6" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-bold text-lg ${
                          !item.available ? "text-gray-500" : ""
                        }`}
                      >
                        {item.name}
                      </h3>
                      <span
                        className={`font-semibold ${
                          !item.available ? "text-gray-400" : "text-primary"
                        }`}
                      >
                        Rs. {item.price}
                      </span>
                    </div>

                    <p
                      className={`text-sm my-2 ${
                        !item.available ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Conditionally render Add to Cart button */}
                    {item.available ? (
                      <Button
                        onClick={() => handleAddToCart(item)}
                        variant="outline"
                        size="sm"
                        className="mt-2 text-primary border-primary hover:bg-secondary"
                      >
                        <PlusCircle className="mr-1 h-4 w-4" /> Add to Cart
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="mt-2 text-gray-400 border-gray-300 cursor-not-allowed bg-transparent"
                        onClick={() =>
                          toast.error(`${item.name} is not available!`)
                        }
                      >
                        Not Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
