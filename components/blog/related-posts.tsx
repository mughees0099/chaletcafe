"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Sample related posts data
const relatedPosts = [
  {
    id: "blog2",
    title: "The Perfect Pairing: Coffee and Desserts",
    excerpt: "Discover which desserts pair perfectly with different types of coffee for a delightful experience.",
    image: "/placeholder.svg?height=300&width=400",
    slug: "coffee-dessert-pairing",
  },
  {
    id: "blog3",
    title: "Single Origin vs. Blends: What's the Difference?",
    excerpt: "Learn about the characteristics of single origin coffees and blends to find your perfect cup.",
    image: "/placeholder.svg?height=300&width=400",
    slug: "single-origin-vs-blends",
  },
  {
    id: "blog4",
    title: "Cold Brew 101: A Beginner's Guide",
    excerpt: "Everything you need to know about making and enjoying cold brew coffee at home.",
    image: "/placeholder.svg?height=300&width=400",
    slug: "cold-brew-guide",
  },
]

interface RelatedPostsProps {
  currentSlug: string
}

export default function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Filter out the current post if it's in the related posts
  const filteredPosts = relatedPosts.filter((post) => post.slug !== currentSlug)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {filteredPosts.map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <Link href={`/blog/${post.slug}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full">
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
