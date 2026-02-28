"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

// Sample blog data
const blogPosts = [
  {
    id: "blog1",
    title: "The Art of Coffee Brewing: Tips from Our Baristas",
    excerpt: "Learn the secrets of brewing the perfect cup of coffee from our expert baristas at Chalet Cafe.",
    date: "May 15, 2023",
    author: "Omar Malik",
    category: "Coffee",
    image: "/placeholder.svg?height=400&width=600",
    slug: "art-of-coffee-brewing",
  },
  {
    id: "blog2",
    title: "Breakfast Around the World: Our International Menu",
    excerpt: "Explore our new international breakfast menu featuring dishes from around the globe.",
    date: "April 28, 2023",
    author: "Fatima Ali",
    category: "Food",
    image: "/placeholder.svg?height=400&width=600",
    slug: "breakfast-around-world",
  },
  {
    id: "blog3",
    title: "Meet the Chef: An Interview with Fatima Ali",
    excerpt: "Get to know our head chef Fatima Ali and discover the inspiration behind our menu.",
    date: "April 10, 2023",
    author: "Ahmed Khan",
    category: "Team",
    image: "/placeholder.svg?height=400&width=600",
    slug: "meet-the-chef",
  },
  {
    id: "blog4",
    title: "The Perfect Pairing: Coffee and Desserts",
    excerpt: "Discover which desserts pair perfectly with different types of coffee for a delightful experience.",
    date: "March 22, 2023",
    author: "Omar Malik",
    category: "Coffee",
    image: "/placeholder.svg?height=400&width=600",
    slug: "coffee-dessert-pairing",
  },
  {
    id: "blog5",
    title: "Sustainable Practices at Chalet Cafe",
    excerpt: "Learn about our commitment to sustainability and the eco-friendly practices we've implemented.",
    date: "March 5, 2023",
    author: "Ahmed Khan",
    category: "Sustainability",
    image: "/placeholder.svg?height=400&width=600",
    slug: "sustainable-practices",
  },
  {
    id: "blog6",
    title: "Recipe: Our Famous Avocado Toast",
    excerpt: "Try making our signature avocado toast at home with this step-by-step recipe from our kitchen.",
    date: "February 18, 2023",
    author: "Fatima Ali",
    category: "Recipes",
    image: "/placeholder.svg?height=400&width=600",
    slug: "avocado-toast-recipe",
  },
]

export default function BlogGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

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
    <div ref={ref} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className={selectedCategory === null ? "bg-primary hover:bg-primary/90" : ""}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary" className="text-primary">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                  </Link>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-secondary p-0">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
