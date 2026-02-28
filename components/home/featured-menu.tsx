"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PlusCircle } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type FeaturedItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export default function FeaturedMenu() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { addToCart } = useCart();
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      const response = await axios.get("/api/Products");
      if (response.status === 200) {
        const uniqueCategories = new Set();
        const filteredData = [];
        for (const item of response.data) {
          if (!item.available) continue;
          if (!uniqueCategories.has(item.category)) {
            uniqueCategories.add(item.category);
            filteredData.push(item);
          }
          if (filteredData.length === 4) break;
        }

        const items = filteredData.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
        }));
        setFeaturedItems(items);
      } else {
        console.error("Failed to fetch featured items");
        toast.error("Failed to load featured items");
      }
    };
    fetchFeaturedItems();
  }, []);

  const handleAddToCart = (item: (typeof featuredItems)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });

    toast.success(`${item.name} added to cart`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
            Our Featured Menu
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular items, crafted with care using the finest
            ingredients
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {featuredItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg menu-item-hover">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-primary font-semibold">
                      Rs. {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-secondary text-primary rounded-full">
                      {item.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90 hover:bg-secondary"
                      onClick={() => handleAddToCart(item)}
                    >
                      <PlusCircle className="mr-1 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
