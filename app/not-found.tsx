import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Coffee className="h-24 w-24 text-amber-800" />
            <span className="absolute top-0 right-0 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              404
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-amber-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-amber-700 mb-8">
          Oops! It seems the page you're looking for has been whisked away.
          Perhaps it's being prepared in our kitchen?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="default"
            className="bg-amber-800 hover:bg-amber-900"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-amber-800 text-amber-800 hover:bg-amber-100"
          >
            <Link href="/menu">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Our Menu
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-amber-200">
          <p className="text-amber-600">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-amber-800 underline underline-offset-2"
            >
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
