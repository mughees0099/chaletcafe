"use client";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import RegisterForm from "@/components/auth/register-form";
import { useCurrentUser } from "@/hooks/currentUser";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
        <span className="ml-2 text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  if (user) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 bg-amber-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-center mb-6">
                Create an Account
              </h1>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
