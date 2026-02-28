"use client";
import { useState } from "react";
import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "./image-upload";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "Pizza",
  "Burgers",
  "Pasta",
  "Panini",
  "Snacks",
  "Desserts",
];

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

interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
  general?: string;
}

export function AddMenuItemForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    available: true,
    featured: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [resetImageTrigger, setResetImageTrigger] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear category error when user selects a category
    if (name === "category" && errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: undefined,
      }));
    }
  };

  const handleImageChange = (imageUrl: string, file?: File) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));

    // Store the file if provided
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
      available: true,
      featured: false,
    });
    setSelectedFile(null);
    setErrors({});
    setIsSuccess(false);
    // Trigger image upload component reset
    setResetImageTrigger((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: undefined }));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = "";

      // Always upload to Cloudinary if there's a selected file
      if (selectedFile) {
        finalImageUrl = await uploadToCloudinary(selectedFile);
      }

      try {
        const response = await axios.post("/api/Products", {
          ...formData,
          image: finalImageUrl, // Use the Cloudinary URL or empty string
        });

        if (response.status === 201) {
          toast.success("Menu item added successfully!");
          resetForm();
          setIsSuccess(true);
        } else {
          throw new Error("Failed to add menu item");
        }
      } catch (error: any) {
        console.error("Error adding menu item:", error);
        setErrors({
          general: error.response?.data?.error || "Failed to add menu item",
        });
        toast.error(error.response?.data?.error || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Failed to upload image. Please try again." });
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Menu Item
        </CardTitle>
        <CardDescription className="text-base">
          Create a new delicious item for your cafe menu
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          id="add-menu-item-form"
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Signature Cappuccino"
                  className={`h-11 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (PKR) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="350"
                  className={`h-11 ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={`h-11 ${
                      errors.category ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your delicious menu item..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Item Image</Label>
                <ImageUpload
                  currentImage={formData.image}
                  onImageChange={handleImageChange}
                  onFileSelect={handleFileSelect}
                  resetTrigger={resetImageTrigger}
                />
                {selectedFile && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">
                      📁 Selected: {selectedFile.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Will upload to Cloudinary when you submit the form
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <Label
                      htmlFor="available"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Available for Order
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Customers can order this item
                    </p>
                  </div>
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("available", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-menu-item-form"
          disabled={isSubmitting}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {selectedFile ? "Uploading Image..." : "Saving..."}
            </>
          ) : (
            "Add Menu Item"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
