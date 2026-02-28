"use client";
import { useState } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "react-toastify";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import axios from "axios";

export default function AdminHeader({ user }: any) {
  const [notifications, setNotifications] = useState(5);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.status === 200) {
        toast.success("Logged out successfully!");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center space-x-4">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">New order #1235 received</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  Rider assigned to order #1234
                </p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  Order #1233 has been delivered
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center text-sm text-blue-600 font-medium">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.avatar || "/default-avatar.png"}
                  alt="Admin"
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 bg-white border shadow-xl rounded-2xl p-6"
                  sideOffset={8}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LogOut className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Sign Out
                    </h4>
                    <p className="text-sm text-gray-600 mb-6">
                      Are you sure you want to sign out of your account?
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="flex-1 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex-1 rounded-xl"
                      >
                        {isLoading ? "Signing out..." : "Sign Out"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
