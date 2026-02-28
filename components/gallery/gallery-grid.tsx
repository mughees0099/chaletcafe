"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GalleryModal from "@/components/gallery/gallery-modal";

const galleryItems = {
  cafe: [
    {
      id: "cafe1",
      src: "/cafe1(memory).png?height=400&width=600",
      alt: "Cafe Interior",
      caption: "Our cozy interior",
    },
    {
      id: "cafe2",
      src: "/cafe3(memory).png?height=400&width=600",
      alt: "Outdoor Seating",
      caption: "Outdoor seating area",
    },
    {
      id: "cafe3",
      src: "/cafe4(memory).png?height=400&width=600",
      alt: "Coffee Bar",
      caption: "Our coffee bar",
    },
    {
      id: "cafe4",
      src: "/cafe6(memory).png?height=400&width=600",
      alt: "Cafe Entrance",
      caption: "Chalet Cafe",
    },
    {
      id: "cafe5",
      src: "/cafe2(memory).png?height=400&width=600",
      alt: "Lounge Area",
      caption: "Comfortable lounge area",
    },
    {
      id: "cafe6",
      src: "/cafe5(memory).png?height=400&width=600",
      alt: "Private Room",
      caption: "Private meeting room",
    },
  ],
  food: [
    {
      id: "food1",
      src: "/menu/Veggie lover.jpg?height=400&width=600",
      alt: "Veggie Lover Pizza",
      caption: "Our famous Veggie Lover Pizza",
    },
    {
      id: "food2",
      src: "/menu/Cheezy weezy.jpg?height=400&width=600",
      alt: "Cheezy Weezy Burger",
      caption: "Our Best Seller Cheezy Weezy Burger",
    },
    {
      id: "food3",
      src: "/menu/Alfredo pasta.jpg?height=400&width=600",
      alt: "Alfredo Pasta",
      caption: "Creamy Alfredo Pasta",
    },
    {
      id: "food4",
      src: "/menu/Spicy grilled chicken.jpg?height=400&width=600",
      alt: "Spicy Grilled Chicken",
      caption: "Delicious Spicy Grilled Chicken Panini",
    },
    {
      id: "food5",
      src: "/menu/Pizza chips.jpg?height=400&width=600",
      alt: "Pizza Chips",
      caption: "Our signature Pizza Chips",
    },
    {
      id: "food6",
      src: "/menu/Lotus cake.jpg?height=400&width=600",
      alt: "Lotus Vanilla Cream",
      caption: "Lotus Vanilla Cream Dessert",
    },
  ],
  events: [
    {
      id: "gradutaion",
      src: "/event1.jpg?height=400&width=600",
      alt: "Graduation Ceremony",
      caption: "Graduation Ceremony at Chalet Cafe",
    },
    {
      id: "graduation2",
      src: "/event2.jpg?height=400&width=600",
      alt: "Graduation Ceremony",
      caption: "Graduation Ceremony at Chalet Cafe",
    },
    {
      id: "birthday",
      src: "/event3.jpg?height=400&width=600",
      alt: "Birthday Party",
      caption: "Birthday Party at Chalet Cafe",
    },
    {
      id: "birthday2",
      src: "/event4.jpg?height=400&width=600",
      alt: "Birthday Party",
      caption: "Birthday Party at Chalet Cafe",
    },
  ],
};

export default function GalleryGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryItems.cafe)[0] | null
  >(null);

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div ref={ref}>
      <Tabs defaultValue="cafe" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="cafe">Cafe</TabsTrigger>
            <TabsTrigger value="food">Food & Drinks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cafe">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {galleryItems.cafe.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative group h-64">
                  <img
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-4">{item.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="food">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {galleryItems.food.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative group h-64">
                  <img
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    className="w-full h-full  object-fill transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-4">{item.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="events">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {galleryItems.events.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative group h-64">
                  <img
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-4">{item.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Image Modal */}
      <GalleryModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
      />
    </div>
  );
}
