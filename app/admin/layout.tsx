"use client";

import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { useCurrentUser } from "@/hooks/currentUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NotFound from "../not-found";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useCurrentUser();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
        <span className="ml-2 text-lg text-gray-700">Loading...</span>
      </div>
    );
  }
  if (!user || user.role !== "admin") {
    if (typeof window !== "undefined") {
      return <NotFound />;
    }
    return null;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto bg-gray-50/50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
