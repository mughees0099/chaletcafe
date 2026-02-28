"use client";

import { useEffect, useState } from "react";
import type React from "react";
import {
  Coffee,
  Home,
  ShoppingBag,
  Settings,
  Clock,
  CheckCircle,
  Camera,
  Eye,
  EyeOff,
  AlertTriangle,
  Package,
  Download,
  MoreHorizontal,
  Loader2,
  LayoutDashboard,
  ChefHat,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  X,
  Edit,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/currentUser";
import Link from "next/link";
import NotFound from "../not-found";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "react-toastify";

const generatePDF = (order: any, user: any) => {
  const receiptWindow = window.open("", "_blank");
  if (!receiptWindow) return;

  const isDelivery = order.orderType === "delivery";
  const deliveryFee = isDelivery ? 150 : 0;
  const subtotal = order.totalAmount - deliveryFee;

  const locationSection = isDelivery
    ? `<div class="address-section">
         <h3>📍 Delivery Address</h3>
         <div class="address-value">${order.deliveryAddress}</div>
       </div>`
    : `<div class="address-section">
         <h3>📍 Pickup Location</h3>
         <div class="address-value">
           <strong>${order.pickupBranch?.branchName}</strong><br>
           ${order.pickupBranch?.branchAddress}<br>
           Phone: ${order.pickupBranch?.branchPhone}
         </div>
       </div>`;

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Receipt - ${order.orderId}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 10px;
          background: #f9f9f9;
          font-size: 12px;
        }
        .receipt {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 15px;
          border-radius: 6px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #dc2626;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .logo {
          font-size: 22px;
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 3px;
        }
        .subtitle {
          color: #666;
          font-size: 11px;
        }
        .order-type-banner {
          background: ${isDelivery ? "#dbeafe" : "#dcfce7"};
          color: ${isDelivery ? "#1e40af" : "#166534"};
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .order-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-section {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #dc2626;
        }
        .info-section h3 {
          color: #333;
          font-size: 13px;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        .info-item {
          margin-bottom: 6px;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info-label {
          color: #666;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        .info-value {
          color: #333;
          font-weight: 500;
          text-align: right;
          max-width: 60%;
          word-wrap: break-word;
          font-size: 11px;
        }
        .address-section {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #dc2626;
          margin-bottom: 15px;
        }
        .address-section h3 {
          color: #333;
          font-size: 13px;
          margin: 0 0 5px 0;
          font-weight: 600;
        }
        .address-value {
          color: #333;
          font-weight: 500;
          font-size: 11px;
          line-height: 1.3;
          word-wrap: break-word;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 11px;
        }
        .items-table th,
        .items-table td {
          padding: 6px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .items-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .total-section {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 4px;
          border-top: 2px solid #dc2626;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 11px;
          padding: 2px 0;
        }
        .total-final {
          font-size: 14px;
          font-weight: bold;
          color: #dc2626;
          border-top: 1px solid #dc2626;
          padding-top: 8px;
          margin-top: 8px;
        }
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-preparing { background: #fed7aa; color: #c2410c; }
        .status-ready { background: #dcfce7; color: #166534; }
        .status-delivered { background: #dbeafe; color: #1d4ed8; }
        .status-collected { background: #dcfce7; color: #166534; }
        .status-cancelled { background: #fecaca; color: #dc2626; }
        .footer {
          text-align: center;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 9px;
          line-height: 1.4;
        }
        .footer p {
          margin: 3px 0;
        }
        @media print {
          body {
            background: white;
            padding: 0;
            margin: 0;
            font-size: 11px;
          }
          .receipt {
            box-shadow: none;
            max-width: none;
            padding: 10px;
            margin: 0;
            page-break-inside: avoid;
          }
          .info-section, .address-section, .total-section {
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            page-break-inside: avoid;
          }
          .items-table {
            page-break-inside: avoid;
          }
          .header {
            page-break-after: avoid;
          }
          .footer {
            page-break-before: avoid;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">☕ Chalet Cafe</div>
          <div class="subtitle">Premium Coffee & Delicious Treats</div>
        </div>
        
        <div class="order-type-banner">
          ${isDelivery ? "🚚 DELIVERY ORDER" : "🏪 PICKUP ORDER"}
        </div>
        
        <div class="order-info">
          <div class="info-section">
            <h3>📋 Order Details</h3>
            <div class="info-item">
              <span class="info-label">Order ID</span>
              <span class="info-value">${order.orderId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Order Type</span>
              <span class="info-value">${
                isDelivery ? "Delivery" : "Pickup"
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date</span>
              <span class="info-value">${new Date(
                order.createdAt
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Time</span>
              <span class="info-value">${new Date(
                order.createdAt
              ).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="status-badge status-${order.status}">${
    order.status
  }</span>
            </div>
          </div>
          
          <div class="info-section">
            <h3>👤 Customer</h3>
            <div class="info-item">
              <span class="info-label">Name</span>
              <span class="info-value">${user.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">${user.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone</span>
              <span class="info-value">${user.phone || "N/A"}</span>
            </div>
          </div>
        </div>
        
        ${locationSection}
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (item: any) => `
              <tr>
                <td><strong>${item.product.name}</strong></td>
                <td>${item.quantity}</td>
                <td>RS. ${item.product.price}</td>
                <td><strong>RS. ${(item.product.price * item.quantity).toFixed(
                  2
                )}</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>RS. ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax (0%):</span>
            <span>RS. 0.00</span>
          </div>
          <div class="total-row">
            <span>${isDelivery ? "Delivery Fee:" : "Pickup Fee:"}</span>
            <span ${!isDelivery ? 'style="color: #16a34a;"' : ""}>
              ${isDelivery ? `RS. ${deliveryFee.toFixed(2)}` : "Free"}
            </span>
          </div>
          <div class="total-row total-final">
            <span>Total Amount:</span>
            <span>RS. ${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing Chalet Cafe! ☕</strong></p>
          <p>For any queries, contact us at <strong>info@chaletcafe.com</strong> | <strong>+92-XXX-XXXXXXX</strong></p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_PRESEST || ""
  );
  formData.append("folder", "Chalet-Cafe");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_KEY}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Upload failed");
    }

    const data = await response.data;
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default function ChalletCafeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [oldPassword, setOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { user, loading } = useCurrentUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
    general: "",
  });
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  useEffect(() => {
    const nameChanged = formData.name !== originalData.name;
    const imageChanged = selectedImage !== null;
    setHasChanges(nameChanged || imageChanged);
  }, [formData, originalData, selectedImage]);

  useEffect(() => {
    if (!user) return;
    try {
      setIsLoading(true);
      const fetchOrders = async () => {
        const response = await axios.get(`/api/orders?userId=${user._id}`);
        if (response.status === 200) {
          setOrders(response.data);
        } else {
          console.error("Failed to fetch orders");
        }
      };
      fetchOrders();
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const validateFullName = (name: string): string => {
    if (!name.trim()) {
      return "Full name can't be empty";
    }
    if (name.trim().length < 4) {
      return "Full name must be at least 4 characters long";
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return "Full name can only contain alphabets and spaces";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSymbols) {
      return "Password must contain at least one symbol";
    }
    return "";
  };

  const validatePasswordForm = (): boolean => {
    const errors = {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
      general: "",
    };

    // Check if all fields are filled
    if (!passwordData.oldpassword.trim()) {
      errors.oldpassword = "Current password is required";
    }
    if (!passwordData.newpassword.trim()) {
      errors.newpassword = "New password is required";
    }
    if (!passwordData.confirmpassword.trim()) {
      errors.confirmpassword = "Confirm password is required";
    }

    // Validate new password strength
    if (passwordData.newpassword.trim()) {
      const passwordValidation = validatePassword(passwordData.newpassword);
      if (passwordValidation) {
        errors.newpassword = passwordValidation;
      }
    }

    if (passwordData.newpassword && passwordData.confirmpassword) {
      if (passwordData.newpassword !== passwordData.confirmpassword) {
        errors.confirmpassword = "Passwords do not match";
      }
    }

    if (passwordData.oldpassword && passwordData.newpassword) {
      if (passwordData.oldpassword === passwordData.newpassword) {
        errors.newpassword =
          "New password must be different from current password";
      }
    }

    setPasswordErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await axios.patch("/api/auth/me", {
        oldPassword: passwordData.oldpassword,
        newPassword: passwordData.newpassword,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setPasswordData({
          oldpassword: "",
          newpassword: "",
          confirmpassword: "",
        });
        setPasswordErrors({
          oldpassword: "",
          newpassword: "",
          confirmpassword: "",
          general: "",
        });
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      if (error.response?.status === 400) {
        setPasswordErrors((prev) => ({
          ...prev,
          oldpassword: "Current password is incorrect",
        }));
      } else if (error.response?.status === 401) {
        setPasswordErrors((prev) => ({
          ...prev,
          general: "Unauthorized. Please login again.",
        }));
      } else {
        setPasswordErrors((prev) => ({
          ...prev,
          general: "Failed to update password. Please try again.",
        }));
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setIsEditMode(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsEditMode(true);

    // Clear name error when user starts typing
    if (field === "name") {
      setNameError("");
    }
  };

  const handleSaveChanges = async () => {
    // Validate full name
    const nameValidationError = validateFullName(formData.name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      const response = await axios.patch("/api/auth/me", {
        ...formData,
        image: imageUrl,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setOriginalData(formData);
        setSelectedImage(null);
        setImagePreview(null);
        setIsEditMode(false);
        setHasChanges(false);
        setNameError("");
        window.location.reload();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const handleCancelChanges = () => {
    setFormData(originalData);
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditMode(false);
    setHasChanges(false);
    setNameError("");
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById(
      "profile-picture"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600 mx-auto mt-20" />
        <div className="mt-4 text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "user") {
    return <NotFound />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <CheckCircle className="h-4 w-4" />;
      case "preparing":
        return <ChefHat className="h-4 w-4" />;
      case "ready":
        return <Package className="h-4 w-4" />;
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "collected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string, orderType = "delivery") => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
            Confirmed
          </Badge>
        );
      case "preparing":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium">
            Preparing
          </Badge>
        );
      case "ready":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
            {orderType === "pickup" ? "Ready for Pickup" : "Ready"}
          </Badge>
        );
      case "out_for_delivery":
        return (
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
            Delivered
          </Badge>
        );
      case "collected":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
            Collected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 font-medium">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusDisplay = (status: string, orderType = "delivery") => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      delivery: {
        pending: "Pending Confirmation",
        confirmed: "Confirmed",
        preparing: "Being Prepared",
        ready: "Ready",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      pickup: {
        pending: "Pending Confirmation",
        confirmed: "Confirmed",
        preparing: "Being Prepared",
        ready: "Ready for Pickup",
        collected: "Collected",
        cancelled: "Cancelled",
      },
    };

    return statusMap[orderType]?.[status] || status;
  };

  const getEstimatedTime = (status: string, orderType = "delivery") => {
    if (orderType === "pickup") {
      switch (status) {
        case "pending":
          return "Waiting for confirmation";
        case "confirmed":
        case "preparing":
          return "20-30 minutes";
        case "ready":
          return "Ready for pickup";
        case "collected":
          return "Collected";
        case "cancelled":
          return "Cancelled";
        default:
          return "Unknown";
      }
    } else {
      switch (status) {
        case "pending":
          return "Waiting for confirmation";
        case "confirmed":
        case "preparing":
          return "30-45 minutes";
        case "ready":
          return "Ready for delivery";
        case "out_for_delivery":
          return "10-15 minutes (on the way)";
        case "delivered":
          return "Delivered";
        case "cancelled":
          return "Cancelled";
        default:
          return "Unknown";
      }
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailDialog(true);
  };

  const handleDownloadReceipt = (order: any) => {
    generatePDF(order, user);
  };

  const OrderDetailModal = () => (
    <Dialog open={orderDetailDialog} onOpenChange={setOrderDetailDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-red-600" />
            </div>
            Order Details - {selectedOrder?.orderId}
          </DialogTitle>
          <DialogDescription>
            Complete information about your order from Chalet Cafe
          </DialogDescription>
        </DialogHeader>
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Type Banner */}
            <div
              className={`p-4 rounded-lg border-l-4 ${
                selectedOrder.orderType === "delivery"
                  ? "bg-blue-50 border-blue-400 text-blue-800"
                  : "bg-green-50 border-green-400 text-green-800"
              }`}
            >
              <div className="flex items-center">
                {selectedOrder.orderType === "delivery" ? (
                  <Truck className="h-5 w-5 mr-2" />
                ) : (
                  <MapPin className="h-5 w-5 mr-2" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {selectedOrder.orderType === "delivery"
                      ? "Delivery Order"
                      : "Pickup Order"}
                  </p>
                  <p className="text-sm opacity-75">
                    {selectedOrder.orderType === "delivery"
                      ? "Your order will be delivered to your address"
                      : "Please collect your order from the selected branch"}
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Order Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Current Status:
                        </span>
                        <Badge
                          className={`${
                            selectedOrder.status === "pending"
                              ? "text-yellow-600 bg-yellow-100"
                              : selectedOrder.status === "preparing"
                              ? "text-orange-600 bg-orange-100"
                              : selectedOrder.status === "ready"
                              ? "text-blue-600 bg-blue-100"
                              : selectedOrder.status === "delivered" ||
                                selectedOrder.status === "collected"
                              ? "text-green-600 bg-green-100"
                              : selectedOrder.status === "cancelled"
                              ? "text-red-600 bg-red-100"
                              : selectedOrder.status === "Out for Delivery"
                              ? "text-purple-600 bg-purple-100"
                              : "text-gray-600 bg-gray-100"
                          } font-medium`}
                        >
                          {getStatusDisplay(
                            selectedOrder.status,
                            selectedOrder.orderType
                          )}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            Order Progress
                          </h4>
                          <span className="text-sm font-medium text-gray-600">
                            {selectedOrder.status === "pending"
                              ? 0
                              : selectedOrder.status === "confirmed"
                              ? 25
                              : selectedOrder.status === "preparing"
                              ? 50
                              : selectedOrder.status === "ready"
                              ? 75
                              : selectedOrder.status === "Out for Delivery"
                              ? 90
                              : selectedOrder.status === "delivered" ||
                                selectedOrder.status === "collected"
                              ? 100
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-primary/90 rounded-full transition-all duration-700 ease-in-out"
                            style={{
                              width:
                                selectedOrder.status === "pending"
                                  ? "0%"
                                  : selectedOrder.status === "confirmed"
                                  ? "25%"
                                  : selectedOrder.status === "preparing"
                                  ? "50%"
                                  : selectedOrder.status === "ready"
                                  ? "75%"
                                  : selectedOrder.status === "Out for Delivery"
                                  ? "90%"
                                  : selectedOrder.status === "delivered" ||
                                    selectedOrder.status === "collected"
                                  ? "100%"
                                  : "0%",
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedOrder.status)}
                          {getStatusDisplay(
                            selectedOrder.status,
                            selectedOrder.orderType
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Order Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">
                          {selectedOrder.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Type:</span>
                        <span className="font-medium capitalize">
                          {selectedOrder.orderType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="font-medium">
                          {getEstimatedTime(
                            selectedOrder.status,
                            selectedOrder.orderType
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {selectedOrder.orderType === "delivery"
                    ? "Delivery Address"
                    : "Pickup Location"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedOrder.orderType === "delivery" ? (
                  <p className="text-gray-700">
                    {selectedOrder.deliveryAddress}
                  </p>
                ) : (
                  selectedOrder.pickupBranch && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        {selectedOrder.pickupBranch.branchName}
                      </p>
                      <p className="text-gray-700">
                        {selectedOrder.pickupBranch.branchAddress}
                      </p>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{selectedOrder.pickupBranch.branchPhone}</span>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.image || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-red-100 text-red-700">
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{user.phone || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items ({selectedOrder.products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.products.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center border">
                          <Coffee className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            RS. {item.product.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          RS. {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      RS.{" "}
                      {selectedOrder.totalAmount -
                        (selectedOrder.orderType === "delivery" ? 150 : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">RS. 0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {selectedOrder.orderType === "delivery"
                        ? "Delivery Fee:"
                        : "Pickup Fee:"}
                    </span>
                    <span
                      className={`font-medium ${
                        selectedOrder.orderType === "pickup"
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {selectedOrder.orderType === "delivery"
                        ? "RS. 150"
                        : "Free"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-red-600">
                      RS. {selectedOrder.totalAmount}
                    </span>
                  </div>
                  {selectedOrder.orderType === "pickup" && (
                    <div className="text-center text-sm text-green-600 font-medium">
                      You saved Rs. 150 on delivery fees!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setOrderDetailDialog(false)}>
            Close
          </Button>
          {selectedOrder &&
            (selectedOrder.status === "delivered" ||
              selectedOrder.status === "collected") && (
              <Button
                onClick={() => handleDownloadReceipt(selectedOrder)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderDashboard = () => (
    <div className="space-y-6 py-8 md:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 md:p-8 border border-red-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Welcome back, {user.name}! ☕
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Ready to enjoy some delicious coffee and treats from Chalet Cafe?
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {orders.length}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  All time orders
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Active Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {
                    orders.filter(
                      (order) =>
                        order.status !== "delivered" &&
                        order.status !== "collected" &&
                        order.status !== "cancelled"
                    ).length
                  }
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Currently processing
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Delivery Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {
                    orders.filter((order) => order.orderType === "delivery")
                      .length
                  }
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Home deliveries
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Truck className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Pickup Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {
                    orders.filter((order) => order.orderType === "pickup")
                      .length
                  }
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Store pickups
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Order Summary */}
      {orders.length > 0 &&
      orders.filter(
        (order) =>
          order.status !== "delivered" &&
          order.status !== "collected" &&
          order.status !== "cancelled"
      ).length > 0 ? (
        <div className="space-y-6 md:space-y-8">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                Current Active Orders
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Track your active orders and their current status
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {orders.filter(
                (order) =>
                  order.status !== "delivered" &&
                  order.status !== "collected" &&
                  order.status !== "cancelled"
              ).length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No active orders</p>
                  <p className="text-gray-400 text-sm">
                    Your active orders will appear here
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {orders
                    .filter(
                      (order) =>
                        order.status !== "delivered" &&
                        order.status !== "collected" &&
                        order.status !== "cancelled"
                    )
                    .map((order) => (
                      <AccordionItem
                        key={order._id}
                        value={order._id}
                        className="border border-gray-200 rounded-lg px-0 data-[state=open]:shadow-md transition-all duration-200"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 rounded-lg data-[state=open]:rounded-b-none">
                          <div className="flex items-center justify-between w-full mr-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <span className="font-semibold text-gray-900">
                                  {order.orderId}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(order.status, order.orderType)}
                                <Badge
                                  variant="outline"
                                  className={`${
                                    order.orderType === "delivery"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                  }`}
                                >
                                  {order.orderType === "delivery"
                                    ? "🚚 Delivery"
                                    : "🏪 Pickup"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right hidden sm:block">
                              <p className="font-semibold text-gray-900">
                                RS. {order.totalAmount}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                          <div className="space-y-6">
                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">
                                  Order Details
                                </h4>
                                <div className="text-sm space-y-1">
                                  <p>
                                    <span className="text-gray-600">
                                      Order Number:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {order.orderId}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Order Type:
                                    </span>{" "}
                                    <span className="font-medium capitalize">
                                      {order.orderType}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Order Time:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {new Date(
                                        order.createdAt
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Total Amount:
                                    </span>{" "}
                                    <span className="font-medium">
                                      RS. {order.totalAmount}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">
                                  {order.orderType === "delivery"
                                    ? "Delivery Info"
                                    : "Pickup Info"}
                                </h4>
                                <div className="text-sm space-y-1">
                                  <p>
                                    <span className="text-gray-600">
                                      Estimated Time:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {getEstimatedTime(
                                        order.status,
                                        order.orderType
                                      )}
                                    </span>
                                  </p>
                                  <p>
                                    <span className="text-gray-600">
                                      Status:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {getStatusDisplay(
                                        order.status,
                                        order.orderType
                                      )}
                                    </span>
                                  </p>
                                  {order.orderType === "pickup" &&
                                    order.pickupBranch && (
                                      <p>
                                        <span className="text-gray-600">
                                          Branch:
                                        </span>{" "}
                                        <span className="font-medium">
                                          {order.pickupBranch.branchName}
                                        </span>
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                            <Separator />
                            {/* Order Items */}
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">
                                Ordered Items
                              </h4>
                              <div className="space-y-3">
                                {order.products.map((item: any) => (
                                  <div
                                    key={item._id}
                                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">
                                        {item.product.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-gray-900">
                                        Rs. {item.product.price * item.quantity}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        RS. {item.product.price} each
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  Order Progress
                                </h4>
                                <span className="text-sm font-medium text-gray-600">
                                  {order.status === "pending"
                                    ? 0
                                    : order.status === "confirmed"
                                    ? 25
                                    : order.status === "preparing"
                                    ? 50
                                    : order.status === "ready"
                                    ? 75
                                    : order.status === "out_for_delivery"
                                    ? 90
                                    : order.status === "delivered" ||
                                      order.status === "collected"
                                    ? 100
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className="h-full bg-primary/90 rounded-full transition-all duration-700 ease-in-out"
                                  style={{
                                    width:
                                      order.status === "pending"
                                        ? "0%"
                                        : order.status === "confirmed"
                                        ? "25%"
                                        : order.status === "preparing"
                                        ? "50%"
                                        : order.status === "ready"
                                        ? "75%"
                                        : order.status === "out_for_delivery"
                                        ? "90%"
                                        : order.status === "delivered" ||
                                          order.status === "collected"
                                        ? "100%"
                                        : "0%",
                                  }}
                                ></div>
                              </div>
                              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                {getStatusIcon(order.status)}
                                {getStatusDisplay(
                                  order.status,
                                  order.orderType
                                )}
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Your last 5 orders from Chalet Cafe
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveTab("orders")}
              size="sm"
            >
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.orderId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {order.orderId}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          order.orderType === "delivery"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(order.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-gray-900">
                      RS. {order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.products.length} items
                    </p>
                  </div>
                  {getStatusBadge(order.status, order.orderType)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage all your orders from Chalet Cafe
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="border-0 shadow-lg bg-white hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="font-semibold text-gray-900 py-4">
                  Order Details
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">
                  Items
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50 border-b border-gray-50"
                >
                  <TableCell className="py-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.orderId}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        •{" "}
                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={`${
                        order.orderType === "delivery"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {order.orderType === "delivery"
                        ? "🚚 Delivery"
                        : "🏪 Pickup"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.products
                          .map((item: any) => item.product.name)
                          .join(", ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.products.length} items
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-semibold text-gray-900">
                      RS. {order.totalAmount}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(order.status, order.orderType)}
                  </TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(order.status === "delivered" ||
                          order.status === "collected") && (
                          <DropdownMenuItem
                            onClick={() => handleDownloadReceipt(order)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="border-0 shadow-lg bg-white">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      #{order.orderId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      •{" "}
                      {new Date(order.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className={`${
                        order.orderType === "delivery"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {order.orderType === "delivery"
                        ? "🚚 Delivery"
                        : "🏪 Pickup"}
                    </Badge>
                    {getStatusBadge(order.status, order.orderType)}
                  </div>
                </div>
                {/* Items */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Items:
                  </p>
                  <p className="text-sm text-gray-900">
                    {order.products
                      .map((item: any) => item.product.name)
                      .join(", ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.products.length} items
                  </p>
                </div>
                {/* Amount and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      RS. {order.totalAmount}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {(order.status === "delivered" ||
                        order.status === "collected") && (
                        <DropdownMenuItem
                          onClick={() => handleDownloadReceipt(order)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your account preferences and profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Profile Information */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl font-semibold">
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and profile picture
                </CardDescription>
              </div>
              {!isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="relative mx-auto sm:mx-0">
                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-gray-100">
                  <AvatarImage
                    src={imagePreview || user.image || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-base md:text-lg font-semibold bg-red-100 text-red-700">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {imagePreview && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-picture"
                  onChange={handleImageSelect}
                  disabled={!isEditMode}
                />
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent w-full sm:w-auto"
                  onClick={() =>
                    document.getElementById("profile-picture")?.click()
                  }
                  disabled={!isEditMode}
                >
                  <Camera className="h-4 w-4" />
                  {imagePreview ? "Change Picture" : "Upload Picture"}
                </Button>
                <p className="text-sm text-gray-500">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
            <Separator />
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`h-11 ${
                    nameError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  disabled={!isEditMode}
                />
                {nameError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {nameError}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  className="h-11"
                  disabled={true}
                  title="Email cannot be changed"
                />
                <p className="text-xs text-gray-500">
                  Email address cannot be changed for security reasons
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            {isEditMode && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                {hasChanges && (
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-red-600 hover:bg-red-700 h-11 flex-1 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleCancelChanges}
                  className="h-11 flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold">
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password for security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Error */}
            {passwordErrors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {passwordErrors.general}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={oldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className={`h-11 pr-10 ${
                    passwordErrors.oldpassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  value={passwordData.oldpassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldpassword: e.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setOldPassword(!oldPassword)}
                >
                  {oldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.oldpassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {passwordErrors.oldpassword}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`h-11 pr-10 ${
                    passwordErrors.newpassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  value={passwordData.newpassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newpassword: e.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.newpassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {passwordErrors.newpassword}
                </p>
              )}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One symbol (!@#$%^&*)</li>
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className={`h-11 pr-10 ${
                    passwordErrors.confirmpassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  value={passwordData.confirmpassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmpassword: e.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.confirmpassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {passwordErrors.confirmpassword}
                </p>
              )}
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 h-11 w-full"
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Fixed Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center px-6 py-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-amber-800 rounded-xl flex items-center justify-center">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <Link href="/">
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">
                      Chalet Cafe
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
            {/* Navigation */}
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Home
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "dashboard"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "orders"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "settings"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
              </nav>
            </div>
            {/* User Profile */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-red-100 text-red-700 font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="grid grid-cols-4">
            <button
              onClick={() => (window.location.href = "/")}
              className={`flex flex-col items-center py-3 px-2 text-xs transition-colors `}
            >
              <Home className="h-5 w-5 mb-1" />
              Home
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center py-3 px-2 text-xs transition-colors ${
                activeTab === "dashboard"
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mb-1" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex flex-col items-center py-3 px-2 text-xs transition-colors ${
                activeTab === "orders"
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600"
              }`}
            >
              <ShoppingBag className="h-5 w-5 mb-1" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center py-3 px-2 text-xs transition-colors ${
                activeTab === "settings"
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600"
              }`}
            >
              <Settings className="h-5 w-5 mb-1" />
              Settings
            </button>
          </div>
        </div>

        <div className="flex-1 lg:ml-64">
          <main className="py-6 px-4 md:py-8 md:px-6 lg:px-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "settings" && renderSettings()}
          </main>
        </div>
      </div>
    </div>
  );
}
