import MainLayout from "@/components/layout/main-layout";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Chalet Cafe Islamabad",
  description:
    "Get in touch with Chalet Cafe for inquiries, feedback, or reservations",
};

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with any questions,
              feedback, or to make a reservation.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8 section-heading">
                  Get In Touch
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Visit Us</h3>
                      <p className="text-gray-600">
                        Main Nazim-ud-din Road F-7/1, Opposite Islamabad Stock
                        Exchange Tower. Islamabad, Pakistan 44000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                      <p className="text-gray-600">0332-5022964</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                      <p className="text-gray-600">info@chaletcafe.pk</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Opening Hours
                      </h3>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 10:00 PM
                      </p>
                      <p className="text-gray-600">
                        Saturday - Sunday: 9:00 AM - 11:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden h-64 md:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.8733961315113!2d73.05!3d33.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQyJzAwLjAiTiA3M8KwMDMnMDAuMCJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Chalet Cafe Location"
                  ></iframe>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8 section-heading">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center section-heading">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Do you take reservations?
                </h3>
                <p className="text-gray-600">
                  Yes, we accept reservations for groups of 4 or more. Please
                  call us or use our online reservation system.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  What are your delivery areas?
                </h3>
                <p className="text-gray-600">
                  We currently deliver to F-6, F-7, F-8, F-10, and G-6 sectors
                  in Islamabad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Do you cater for events?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer catering services for corporate events, parties,
                  and special occasions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">
                  Is there parking available?
                </h3>
                <p className="text-gray-600">
                  Yes, we have dedicated parking spaces available for our
                  customers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
