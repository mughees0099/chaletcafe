"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (!phone) {
      return "Phone number is required";
    }

    if (!phone.startsWith("03")) {
      return "Phone number must start with 03";
    }

    if (cleanPhone.length !== 11) {
      return "Phone number must be exactly 11 digits";
    }

    const validPrefixes = [
      "030",
      "031",
      "032",
      "033",
      "034",
      "035",
      "036",
      "037",
      "038",
      "039",
    ];
    const prefix = cleanPhone.substring(0, 3);

    if (!validPrefixes.includes(prefix)) {
      return "Please enter a valid Pakistani mobile number";
    }

    return "";
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation
    const emailError = validateEmail(value);
    setErrors((prev) => ({ ...prev, email: emailError }));
  };

  // Handle phone change with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);

    // Real-time validation
    const phoneError = validatePhone(value);
    setErrors((prev) => ({ ...prev, phone: phoneError }));
  };

  // Clear errors when switching tabs
  const handleTabChange = (value: string) => {
    setLoginMethod(value);
    setErrors({ email: "", phone: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    let hasErrors = false;
    const newErrors = { email: "", phone: "" };

    if (loginMethod === "email") {
      const emailError = validateEmail(email);
      if (emailError) {
        newErrors.email = emailError;
        hasErrors = true;
      }
    } else {
      const phoneError = validatePhone(phone);
      if (phoneError) {
        newErrors.phone = phoneError;
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email: loginMethod === "email" ? email : "",
        phone: loginMethod === "phone" ? phone : "",
        password,
        rememberMe,
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        switch (response.data.userType) {
          case "user":
            window.location.href = "/";
            break;
          case "admin":
            window.location.href = "/admin";
            break;
          default:
            break;
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Tabs
          defaultValue="email"
          value={loginMethod}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone Number</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-2 mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={handleEmailChange}
              className={
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </TabsContent>

          <TabsContent value="phone" className="space-y-2 mt-4">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="03123456789"
              value={phone}
              onChange={handlePhoneChange}
              className={
                errors.phone ? "border-red-500 focus:border-red-500" : ""
              }
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500">
              Format: 03123456789 (11 digits starting with 03)
            </p>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgotPassword"
              className="text-sm text-amber-800 hover:text-amber-900"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center border rounded-md">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative border-0 focus:ring-0"
            />
            <Button
              type="button"
              variant="link"
              className="text-sm text-amber-800 hover:text-amber-900 px-3"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(!!checked)}
        />
        <Label htmlFor="remember-me" className="text-sm">
          Remember me
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-800 hover:bg-amber-900"
        disabled={
          isLoading ||
          (loginMethod === "email" ? !!errors.email : !!errors.phone)
        }
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-amber-800 hover:text-amber-900 font-medium"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
