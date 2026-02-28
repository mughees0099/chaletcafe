"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Home,
  UtensilsCrossed,
  Info,
  Phone,
  Camera,
  Settings,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart/cart-provider";
import CartDrawer from "@/components/cart/cart-drawer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button as UIButton } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/currentUser";
import Image from "next/image";
import axios from "axios";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/gallery", label: "Gallery", icon: Camera },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [mobileLogoutOpen, setMobileLogoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setMobileLogoutOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed flex justify-center max-w-[1600px] mx-auto top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 py-3"
            : "bg-white/80 backdrop-blur-sm py-5"
        }`}
      >
        <div className="container px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.span
                className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Chalet Cafe
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-full px-2 py-2 border border-gray-200/50">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative group"
                    >
                      <motion.div
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-white shadow-lg"
                            : "text-gray-700 hover:bg-white hover:text-primary hover:shadow-md"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          {link.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-primary rounded-full -z-10"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Cart Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full h-10 w-10 relative"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold">
                        {totalItems}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-full px-3 py-2 h-10"
                    >
                      {loading ? (
                        <div className="w-7 h-7 bg-gray-200 animate-pulse rounded-full" />
                      ) : user ? (
                        <>
                          <div className="relative">
                            <Image
                              src={user.image || "/default-avatar.jpg"}
                              alt="User Avatar"
                              className="h-7 w-7 rounded-full border-2 border-gray-200"
                              width={28}
                              height={28}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium max-w-20 truncate">
                            {user.name?.split(" ")[0] ||
                              user.username ||
                              user.email?.split("@")[0]}
                          </span>
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </>
                      ) : (
                        <>
                          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium">Account</span>
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-2xl p-2"
                  sideOffset={8}
                >
                  {user ? (
                    <>
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Image
                              src={user.image || "/default-avatar.jpg"}
                              alt="User Avatar"
                              className="h-12 w-12 rounded-full border-2 border-gray-200"
                              width={48}
                              height={48}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.name || user.username || "User"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <DropdownMenuItem asChild>
                          <Link
                            href={
                              user.role === "user"
                                ? "/dashboard"
                                : user.role === "admin"
                                ? "/admin"
                                : "/"
                            }
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer"
                          >
                            <Settings className="h-4 w-4" />
                            <span className="font-medium">Profile</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-2" />

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
                                  Are you sure you want to sign out of your
                                  account?
                                </p>
                                <div className="flex space-x-3">
                                  <UIButton
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-xl"
                                  >
                                    Cancel
                                  </UIButton>
                                  <UIButton
                                    variant="destructive"
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className="flex-1 rounded-xl"
                                  >
                                    {isLoading ? "Signing out..." : "Sign Out"}
                                  </UIButton>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </DropdownMenuItem>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Guest User */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Welcome!
                            </p>
                            <p className="text-sm text-gray-500">
                              Sign in to your account
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        {loading ? (
                          <>
                            <div className="w-full h-10 bg-gray-200 animate-pulse rounded-xl" />
                            <div className="w-full h-10 bg-gray-200 animate-pulse rounded-xl" />
                          </>
                        ) : (
                          <>
                            <Link href="/login" className="block">
                              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5">
                                Sign In
                              </Button>
                            </Link>
                            <Link href="/register" className="block">
                              <Button
                                variant="outline"
                                className="w-full rounded-xl py-2.5 bg-transparent"
                              >
                                Create Account
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Order Now Button */}
              <Link href="/menu">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Order Now
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full h-10 w-10 relative mr-2"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full h-10 w-10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Professional Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl lg:hidden z-50 border-l border-gray-200"
                style={{ backgroundColor: "#ffffff" }} // Force solid white background
              >
                <div className="flex flex-col h-full bg-white">
                  {" "}
                  {/* Add bg-white here too */}
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* User Section */}
                  <div className="p-6 border-b border-gray-100 bg-white">
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full" />
                        <div className="flex-1">
                          <div className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-2" />
                          <div className="w-16 h-3 bg-gray-200 animate-pulse rounded" />
                        </div>
                      </div>
                    ) : user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Image
                              src={user.image || "/default-avatar.jpg"}
                              alt="User Avatar"
                              className="h-12 w-12 rounded-full border-2 border-gray-200"
                              width={48}
                              height={48}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              {user.name || user.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full inline-block">
                              {user.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            href={
                              user.role === "user"
                                ? "/dashboard"
                                : user.role === "admin"
                                ? "/admin"
                                : "/"
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs bg-white border-gray-200"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                          </Link>

                          <Popover
                            open={mobileLogoutOpen}
                            onOpenChange={setMobileLogoutOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-red-600 border-red-200 hover:bg-red-50 bg-white"
                              >
                                <LogOut className="h-3 w-3 mr-1" />
                                Logout
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 bg-white border shadow-lg">
                              <div className="p-4 bg-white">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Confirm Logout
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                  Are you sure you want to logout?
                                </p>
                                <div className="flex justify-end space-x-2">
                                  <UIButton
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setMobileLogoutOpen(false)}
                                    className="bg-white"
                                  >
                                    Cancel
                                  </UIButton>
                                  <UIButton
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? "Logging out..." : "Logout"}
                                  </UIButton>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Welcome!
                            </p>
                            <p className="text-xs text-gray-500">
                              Sign in to your account
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1"
                          >
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full text-xs"
                            >
                              Login
                            </Button>
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs bg-white border-gray-200"
                            >
                              Register
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Navigation Links */}
                  <nav className="flex-1 px-6 py-4 bg-white">
                    <div className="space-y-2">
                      {navLinks.map((link, index) => {
                        const IconComponent = link.icon;
                        const isActive = pathname === link.href;

                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              href={link.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                  ? "bg-primary text-white shadow-lg"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                              }`}
                            >
                              <IconComponent className="h-5 w-5" />
                              <span className="font-medium">{link.label}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="ml-auto w-2 h-2 bg-white rounded-full"
                                />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </nav>
                  {/* Bottom Action */}
                  <div className="p-6 border-t border-gray-100 bg-white">
                    <Link
                      href="/menu"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg">
                        <UtensilsCrossed className="h-5 w-5 mr-2" />
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
