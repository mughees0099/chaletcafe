import MainLayout from "@/components/layout/main-layout";
import type { Metadata } from "next";
import { Coffee, Users, Award, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Chalet Cafe Islamabad",
  description:
    "Learn about our story, mission, and the team behind Chalet Cafe",
};

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Chalet Cafe
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              A cozy retreat in the heart of Islamabad, where exceptional coffee
              meets delicious food and warm hospitality.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 section-heading">
                  Our Story
                </h2>
                <p className="text-gray-700 mb-4">
                  Chalet Cafe was founded in 2018 by a group of friends who
                  shared a passion for exceptional coffee and food. What started
                  as a small coffee shop has grown into one of Islamabad's most
                  beloved cafes.
                </p>
                <p className="text-gray-700 mb-4">
                  Our journey began with a simple mission: to create a warm,
                  inviting space where people could enjoy high-quality coffee,
                  delicious food, and genuine hospitality. We wanted to build
                  more than just a cafe; we wanted to create a community hub
                  where people could connect, work, and relax.
                </p>
                <p className="text-gray-700">
                  Over the years, we've stayed true to our founding principles
                  while continuously evolving to meet the needs of our
                  customers. From sourcing the finest coffee beans to crafting
                  innovative menu items, every decision we make is guided by our
                  commitment to quality and customer satisfaction.
                </p>
              </div>
              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-xl ">
                  <img
                    src="/image3.jpeg"
                    alt="Chalet Cafe Interior"
                    className="h-[500px] w-full"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-primary font-bold">Est. 2018</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center section-heading">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-600">
                  We never compromise on quality. From our coffee beans to our
                  ingredients, we source only the best.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We believe in creating spaces where people can connect, share
                  ideas, and build relationships.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly explore new flavors, techniques, and ideas to
                  provide unique experiences.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to environmentally responsible practices in
                  everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center section-heading">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                  <img
                    src="/about-boy1.jpg?height=200&width=200"
                    alt="Ahmed Khan - Founder & CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Ahmed Khan</h3>
                <p className="text-primary mb-2">Founder & CEO</p>
                <p className="text-gray-600 max-w-sm mx-auto">
                  With over 15 years in the hospitality industry, Ahmed brings
                  his passion for exceptional service to Chalet Cafe.
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                  <img
                    src="/about-girl1.jpg?height=200&width=200"
                    alt="Fatima Ali - Head Chef"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Fatima Ali</h3>
                <p className="text-primary mb-2">Head Chef</p>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Fatima's culinary expertise and creativity are behind our
                  delicious and innovative menu offerings.
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                  <img
                    src="/about-boy2.jpg?height=200&width=200"
                    alt="Omar Malik - Master Barista"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Omar Malik</h3>
                <p className="text-primary mb-2">Master Barista</p>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Omar's deep knowledge of coffee and dedication to perfection
                  ensures every cup is exceptional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center section-heading">
              Our Journey
            </h2>
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>

              {/* Milestones */}
              <div className="grid grid-cols-1 gap-12">
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white"></div>
                    <div className="w-1/2 pr-8 text-right">
                      <h3 className="text-xl font-semibold mb-2">2018</h3>
                      <p className="text-gray-600">
                        Chalet Cafe opens its doors in F-7, Islamabad
                      </p>
                    </div>
                    <div className="w-1/2 pl-8 ">
                      <img
                        src="/image4.jpeg?height=150&width=250"
                        alt="Cafe Opening"
                        className="rounded-lg shadow-md md:h-[400px] w-full "
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white"></div>
                    <div className="w-1/2 pr-8 text-right">
                      <img
                        src="/image7.jpg?height=150&width=250"
                        alt="Menu Expansion"
                        className="rounded-lg shadow-md ml-auto md:h-[400px] w-full"
                      />
                    </div>
                    <div className="w-1/2 pl-8">
                      <h3 className="text-xl font-semibold mb-2">2020</h3>
                      <p className="text-gray-600">
                        Expanded our menu and introduced our signature dishes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white"></div>
                    <div className="w-1/2 pr-8 text-right">
                      <h3 className="text-xl font-semibold mb-2">2022</h3>
                      <p className="text-gray-600">
                        Launched online ordering and delivery services
                      </p>
                    </div>
                    <div className="w-1/2 pl-8">
                      <img
                        src="/image8.png?height=150&width=250"
                        alt="Online Ordering"
                        className="rounded-lg shadow-md md:h-[400px] w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white"></div>
                    <div className="w-1/2 pr-8 text-right">
                      <img
                        src="/image6.jpeg?height=150&width=250"
                        alt="New Location"
                        className="rounded-lg shadow-md ml-auto md:h-[400px] w-full"
                      />
                    </div>
                    <div className="w-1/2 pl-8">
                      <h3 className="text-xl font-semibold mb-2">2023</h3>
                      <p className="text-gray-600">
                        Opened our second location in F-10, Islamabad
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
