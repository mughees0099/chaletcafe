"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { generateOTP } from "@/lib/otp";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Password validation states
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });

  const router = useRouter();

  // Password validation function
  const validatePassword = (password: string) => {
    const strength = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasMinLength: password.length >= 8,
    };

    setPasswordStrength(strength);

    return (
      strength.hasUpperCase &&
      strength.hasLowerCase &&
      strength.hasNumber &&
      strength.hasSymbol &&
      strength.hasMinLength
    );
  };

  // Phone number validation - only allow numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Limit to 11 characters
    if (numericValue.length <= 11) {
      setFormData((prev) => ({ ...prev, phone: numericValue }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      handlePhoneChange(e);
      return;
    }

    if (name === "password") {
      validatePassword(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "Phone number must be exactly 11 digits";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only numbers";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password doesn't meet security requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    const { name, email, phone, password } = formData;

    const formattedName = name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    try {
      const response = await axios.post("/api/auth/register", {
        name: formattedName,
        email: email.toLowerCase(),
        phone: phone.replace(/\D/g, ""),
        password,
      });

      if (response.status === 201) {
        toast.success("Account created successfully!");
        try {
          const otp = generateOTP();
          if (!otp) {
            toast.error("Failed to generate OTP. Please try again.");
            return;
          }
          const subject = "Verify Your Chalet Cafe Account – OTP Code Inside";
          const text = `Hello ${formattedName},

Thank you for registering with Chalet Cafe!

Your one-time password (OTP) for account verification is: ${otp}

This code will expire in 5 minutes. Please do not share it with anyone.

If you didn’t request this, please ignore this email.

– Chalet Cafe Team
`;

          const html = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td align="center" style="background-color: #FFD700; padding: 30px;">
                <h1 style="margin: 0; color: #111;">Account Verification</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">
                  Hello <strong>${formattedName}</strong>,
                </p>
                <p style="font-size: 16px; color: #333;">
                  Thank you for registering with <strong>Chalet Cafe</strong>! 👋
                </p>
                <p style="font-size: 16px; color: #333;">
                  Your OTP for verifying your account is:
                </p>

                <div style="margin: 20px 0; text-align: center;">
                  <span style="font-size: 24px; font-weight: bold; background-color: #f1f1f1; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                    ${otp}
                  </span>
                </div>

                <p style="font-size: 16px; color: #333;">
                  This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.
                </p>
                <p style="font-size: 14px; color: #999;">
                  If you did not request this code, you can safely ignore this email.
                </p>

                <p style="font-size: 14px; color: #999;">
                  – Chalet Cafe Team
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Chalet Cafe. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

          const otpResponse = await axios.post("/api/auth/register/sendOtp", {
            email: email.toLowerCase(),
            otp,
            subject,
            text,
            html,
          });
          if (otpResponse.status === 200) {
            toast.success("OTP sent to your email. Please verify.");
            router.push(`/register/verify?email=${encodeURIComponent(email)}`);
          } else {
            toast.error("Failed to send OTP. Please try again.");
          }
        } catch (error) {
          console.error("Error during registration:", error);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("An account with this email already exists");
        } else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
          required
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "border-red-500" : ""}
          required
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="text"
          placeholder="03123456789"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? "border-red-500" : ""}
          maxLength={11}
          required
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        <p className="text-xs text-gray-500">
          Enter 11-digit phone number (numbers only)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-amber-800" />
            ) : (
              <EyeIcon className="h-4 w-4 text-amber-800" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}

        {/* Password strength indicators */}
        <div className="mt-2 space-y-1">
          <p className="text-xs font-medium text-gray-700">
            Password must contain:
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <p
              className={`text-xs flex items-center gap-1 ${
                passwordStrength.hasUpperCase
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <span
                className={
                  passwordStrength.hasUpperCase
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                ✓
              </span>
              Uppercase letter
            </p>
            <p
              className={`text-xs flex items-center gap-1 ${
                passwordStrength.hasLowerCase
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <span
                className={
                  passwordStrength.hasLowerCase
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                ✓
              </span>
              Lowercase letter
            </p>
            <p
              className={`text-xs flex items-center gap-1 ${
                passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"
              }`}
            >
              <span
                className={
                  passwordStrength.hasNumber
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                ✓
              </span>
              Number
            </p>
            <p
              className={`text-xs flex items-center gap-1 ${
                passwordStrength.hasSymbol ? "text-green-600" : "text-gray-500"
              }`}
            >
              <span
                className={
                  passwordStrength.hasSymbol
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                ✓
              </span>
              Symbol
            </p>
            <p
              className={`text-xs flex items-center gap-1 col-span-2 ${
                passwordStrength.hasMinLength
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              <span
                className={
                  passwordStrength.hasMinLength
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                ✓
              </span>
              At least 8 characters
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={
              errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
            }
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-amber-800" />
            ) : (
              <EyeIcon className="h-4 w-4 text-amber-800" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-800 hover:bg-amber-900 mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-amber-800 hover:text-amber-900 font-medium"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
