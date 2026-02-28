"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/image2.jpeg"
                alt="Chalet Cafe Interior"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="text-primary font-bold">Est. 2018</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 section-heading">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4">
              Nestled in the heart of Islamabad, Chalet Cafe was born from a
              passion for creating a warm, inviting space where people could
              enjoy exceptional coffee and food.
            </p>
            <p className="text-gray-700 mb-6">
              Since opening our doors in 2018, we've been committed to sourcing
              the finest ingredients, supporting local producers, and crafting
              each item on our menu with care and attention to detail.
            </p>
            <p className="text-gray-700 mb-8">
              Our cafe has become a beloved gathering place for locals and
              visitors alike, known for our friendly service, cozy atmosphere,
              and of course, our delicious offerings.
            </p>
            <Link href="/about">
              <Button className="bg-primary hover:bg-primary/90">
                Learn More About Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
