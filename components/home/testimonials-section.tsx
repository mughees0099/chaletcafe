"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Regular Customer",
    content:
      "Chalet Cafe has become my go-to spot for both work meetings and casual catch-ups. The atmosphere is perfect, and their signature Lotus Cake is unmatched in Islamabad!",
    rating: 5,
    image: "/girl1.jpg?height=100&width=100",
  },
  {
    id: 2,
    name: "Usman Khan",
    role: "Food Blogger",
    content:
      "As someone who reviews cafes professionally, I can confidently say that Chalet Cafe stands out for its exceptional food quality and attention to detail. Their snack menu is a must-try!",
    rating: 5,
    image: "/boy1.jpg?height=100&width=100",
  },
  {
    id: 3,
    name: "Ayesha Malik",
    role: "Local Resident",
    content:
      "I've been ordering from Chalet Cafe since they launched their delivery service, and I'm always impressed by how quickly my food arrives and how fresh it tastes. Highly recommend!",
    rating: 4,
    image: "/girl2.jpg?height=100&width=100",
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 section-heading">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our valued customers
            about their Chalet Cafe experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 flex-grow">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-auto flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
