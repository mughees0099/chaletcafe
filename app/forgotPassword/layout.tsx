import type React from "react";
import MainLayout from "@/components/layout/main-layout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forgot Password | Chalet Cafe Islamabad",
  description: "Reset your Chalet Cafe account password",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
