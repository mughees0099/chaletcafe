"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  EyeOff,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { generateOTP } from "@/lib/otp";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/currentUser";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateOTP = (otp: string) => {
  return /^\d{6}$/.test(otp);
};

const validatePassword = (password: string) => {
  const checks = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    hasMinLength: password.length >= 8,
  };

  const isValid = Object.values(checks).every(Boolean);
  return { checks, isValid };
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { user: currentUser, loading } = useCurrentUser();

  // Email validation on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // OTP validation on change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      if (value && !validateOTP(value)) {
        setOtpError("OTP must be 6 digits");
      } else {
        setOtpError("");
      }
    }
  };

  // Password validation on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const validation = validatePassword(value);
    setPasswordStrength(validation.checks);

    if (value && !validation.isValid) {
      setPasswordError("Password does not meet all requirements");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const otpCode = generateOTP();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/register/sendOtp", {
        email,
        otp: otpCode,
        subject: "Password Reset Request",
        text: `Your OTP for password reset is ${otpCode}`,
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Password Reset OTP</title>
            <style>
              body {
                background-color: #fef2f2;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
              }
        
              .container {
                max-width: 480px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 8px;
                padding: 32px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border-left: 6px solid #dc2626;
              }
        
              .header {
                text-align: center;
                margin-bottom: 24px;
              }
        
              .header h1 {
                font-size: 22px;
                color: #dc2626;
                margin: 0;
              }
        
              .content {
                font-size: 15px;
                color: #444444;
                line-height: 1.6;
              }
        
              .otp-box {
                background-color: #fff1f2;
                color: #b91c1c;
                padding: 16px;
                text-align: center;
                font-size: 28px;
                font-weight: bold;
                border-radius: 6px;
                margin: 24px 0;
                letter-spacing: 4px;
                border: 2px dashed #f87171;
              }
        
              .footer {
                font-size: 13px;
                text-align: center;
                color: #999999;
                margin-top: 32px;
              }
            </style>
          </head>
        
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset OTP</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>
                  We received a request to reset your password. Please use the OTP code below to complete the process:
                </p>
                <div class="otp-box">${otpCode}</div>
                <p>This OTP is valid for <strong>15 minutes</strong>.</p>
                <p>
                  <strong>Didn't request this?</strong> You can safely ignore this email.
                </p>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Chalet cafe. All rights reserved.
              </div>
            </div>
          </body>
        </html>`,
      });

      if (response.status === 200) {
        setIsSubmitted(true);
        toast.success("OTP sent successfully! Check your email.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP before submission
    if (!validateOTP(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register/verifyOtp", {
        email,
        otp,
      });

      if (response.status === 200) {
        setIsOtpVerified(true);
        toast.success("OTP verified successfully!");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setOtpError("Invalid OTP. Please try again.");
      toast.error(
        err.response?.data?.error || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password before submission
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordError("Password does not meet all requirements");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully! You can now log in.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
      // Reset form state
      setIsOtpVerified(false);
      setIsSubmitted(false);
      setEmail("");
      setOtp("");
      setPassword("");
      setPasswordStrength({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSymbol: false,
        hasMinLength: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-luxury-cream to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            You are already logged in!
          </h1>
          <Link href="/" className="text-lg text-luxury-gold hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            Chalet Cafe
          </Link>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        {!isOtpVerified &&
          (!isSubmitted ? (
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mx-auto mb-4 w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center"
                >
                  <Mail className="h-8 w-8 text-luxury-gold" />
                </motion.div>
                <CardTitle className="text-primary">Forgot Password?</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you OTP to reset your
                  password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className={`h-12 ${emailError ? "border-red-500" : ""}`}
                    />
                    {emailError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{emailError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-luxury-gold hover:bg-luxury-gold/90 text-white font-semibold"
                      disabled={isLoading || !!emailError || !email}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-primary hover:underline flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center relative">
                <ArrowLeft
                  className="absolute left-4 top-4 h-5 w-5 text-primary cursor-pointer hover:text-primary/80"
                  onClick={() => {
                    setIsSubmitted(false);
                    setOtp("");
                    setOtpError("");
                  }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mx-auto mb-4 w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-luxury-gold" />
                </motion.div>
                <CardTitle className="text-primary">Enter OTP</CardTitle>
                <CardDescription>
                  We have sent a 6-digit OTP to your email address. Please enter
                  it below to verify your identity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={verifyOtp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={otp}
                      maxLength={6}
                      onChange={handleOtpChange}
                      className={`h-12 text-center text-lg tracking-widest `}
                      placeholder="000000"
                      required
                    />
                    {otpError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{otpError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-luxury-gold hover:bg-luxury-gold/90 text-white font-semibold"
                      disabled={isLoading || !!otpError || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4 mt-6"
                >
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try
                    again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setOtp("");
                      setOtpError("");
                    }}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          ))}

        {isOtpVerified && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <CardTitle className="text-primary">
                Create New Password
              </CardTitle>
              <CardDescription>
                Please enter a new password to reset your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onSubmit={resetPassword}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div
                    className={`flex items-center border rounded-md ${
                      passwordError ? "border-red-500" : ""
                    }`}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      className={`h-12 border-none `}
                      placeholder="Enter new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-amber-800 hover:text-amber-900 px-3"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <EyeIcon size={16} />
                      )}
                    </Button>
                  </div>
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-3">
                    Password Requirements:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.hasMinLength
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordStrength.hasMinLength
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.hasUpperCase
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordStrength.hasUpperCase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.hasLowerCase
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordStrength.hasLowerCase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.hasNumber
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordStrength.hasNumber
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        One number
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.hasSymbol
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          passwordStrength.hasSymbol
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        One special character
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-luxury-gold hover:bg-luxury-gold/90 text-white font-semibold"
                    disabled={
                      isLoading ||
                      !!passwordError ||
                      !validatePassword(password).isValid
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
