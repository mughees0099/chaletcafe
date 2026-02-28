import MainLayout from "@/components/layout/main-layout"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import RelatedPosts from "@/components/blog/related-posts"

// This would be replaced with a dynamic metadata function in a real app
export const metadata: Metadata = {
  title: "Blog Post | Chalet Cafe Islamabad",
  description: "Read our latest article",
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, this would fetch the blog post data based on the slug
  const post = {
    title: "The Art of Coffee Brewing: Tips from Our Baristas",
    date: "May 15, 2023",
    author: "Omar Malik",
    category: "Coffee",
    image: "/placeholder.svg?height=600&width=1200",
    content: `
      <p>Coffee brewing is both an art and a science. At Chalet Cafe, our baristas have perfected the craft of brewing the perfect cup of coffee. In this article, we'll share some of their secrets with you.</p>
      
      <h2>The Importance of Fresh Beans</h2>
      <p>The journey to a perfect cup of coffee begins with the beans. Always use freshly roasted beans, ideally within two weeks of their roast date. At Chalet Cafe, we source our beans from sustainable farms and roast them in small batches to ensure maximum freshness.</p>
      
      <p>Store your beans in an airtight container away from direct sunlight, heat, and moisture. Contrary to popular belief, storing beans in the refrigerator or freezer can actually introduce moisture and compromise flavor.</p>
      
      <h2>Grinding Matters</h2>
      <p>The grind size significantly impacts the extraction process. Different brewing methods require different grind sizes:</p>
      <ul>
        <li>French Press: Coarse grind</li>
        <li>Drip Coffee: Medium grind</li>
        <li>Espresso: Fine grind</li>
        <li>Turkish Coffee: Extra fine grind</li>
      </ul>
      
      <p>Always grind your beans just before brewing to preserve the aromatic oils that contribute to flavor.</p>
      
      <h2>Water Quality and Temperature</h2>
      <p>Water makes up more than 98% of brewed coffee, so its quality is crucial. Use filtered water free from strong odors or flavors. The ideal water temperature for brewing is between 195°F and 205°F (90°C to 96°C). Water that's too hot will extract bitter compounds, while water that's too cool will result in under-extraction.</p>
      
      <h2>Brewing Techniques</h2>
      <p>Each brewing method has its own techniques for optimal extraction. Here are some tips for popular methods:</p>
      
      <h3>Pour-Over</h3>
      <p>Start with a 30-second bloom (pre-infusion) by pouring just enough water to saturate the grounds. This allows CO2 to escape and prepares the coffee for even extraction. Then, pour in slow, steady spirals from the center outward.</p>
      
      <h3>French Press</h3>
      <p>After adding water to the grounds, stir gently and let steep for 4 minutes. Before plunging, skim off the crust that forms on top for a cleaner cup.</p>
      
      <h3>Espresso</h3>
      <p>Proper tamping is essential for even extraction. Apply about 30 pounds of pressure and ensure the coffee bed is level. The ideal extraction time for a double shot is between 25-30 seconds.</p>
      
      <h2>The Barista's Touch</h2>
      <p>Beyond these technical aspects, there's an intuitive element to coffee brewing that comes with experience. Our baristas at Chalet Cafe have developed a feel for when a coffee is brewing perfectly, often making subtle adjustments based on factors like humidity and bean freshness.</p>
      
      <p>We invite you to visit Chalet Cafe to experience the results of our baristas' expertise firsthand. And if you're passionate about coffee, ask questions! Our team loves sharing their knowledge with fellow coffee enthusiasts.</p>
    `,
  }

  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{post.category}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden mb-8">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-auto" />
          </div>

          <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="border-t border-b py-6 my-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="font-medium">Share this article:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" aria-label="Share on Facebook">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Share on Twitter">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Share on LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8 section-heading">Related Articles</h2>
            <RelatedPosts currentSlug={params.slug} />
          </div>
        </article>
      </div>
    </MainLayout>
  )
}
