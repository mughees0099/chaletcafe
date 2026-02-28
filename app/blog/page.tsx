import MainLayout from "@/components/layout/main-layout"
import type { Metadata } from "next"
import BlogGrid from "@/components/blog/blog-grid"

export const metadata: Metadata = {
  title: "Blog | Chalet Cafe Islamabad",
  description: "Read our latest articles, recipes, and cafe updates",
}

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl max-w-3xl mx-auto">Discover our latest articles, recipes, and cafe updates</p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <BlogGrid />
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
