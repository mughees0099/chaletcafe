"use client";
import { useState } from "react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { ImageUpload } from "./image-upload";
import axios from "axios";

const categories = [
  "Pizza",
  "Burgers",
  "Pasta",
  "Panini",
  "Snacks",
  "Desserts",
];

const ensureValidImageUrl = (url: string) => {
  if (!url) return "/placeholder.svg?height=200&width=200";
  if (url.startsWith("blob:")) return "/placeholder.svg?height=200&width=200";
  return url;
};

// Cloudinary upload function
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

interface EditMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    _id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    available: boolean;
    featured: boolean;
  };
  onSave: (item: any) => void;
}

export function EditMenuItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: EditMenuItemDialogProps) {
  const [formData, setFormData] = useState({
    id: item._id,
    name: item.name,
    price: item.price,
    category: item.category,
    description: item.description,
    image: ensureValidImageUrl(item.image),
    available: item.available,
    featured: item.featured,
  });

  // Track if image has been changed and store the new file
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [originalImageUrl] = useState(item.image); // Store original image URL
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  };

  // Modified image change handler
  const handleImageChange = (imageUrl: string, file?: File) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));

    // If a new file is provided, store it
    if (file) {
      setNewImageFile(file);
    } else {
      setNewImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = formData.image;

      // Only upload to Cloudinary if there's a new image file
      if (newImageFile && newImageFile instanceof File) {
        console.log("Uploading new image to Cloudinary...", newImageFile.name);
        finalImageUrl = await uploadToCloudinary(newImageFile);
        console.log("Upload successful, new URL:", finalImageUrl);
      } else {
        console.log("No new image file, using existing URL:", originalImageUrl);
        finalImageUrl = originalImageUrl;
      }

      // Save the item with the final image URL
      onSave({
        ...formData,
        image: finalImageUrl,
        price: Number.parseFloat(formData.price.toString()),
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Menu Item
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Item Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (PKR)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger className="h-11">
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
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Item Image</Label>
                <ImageUpload
                  currentImage={formData.image}
                  onImageChange={handleImageChange}
                />
              </div>
              <div className="space-y-4 pt-4">
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
          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUploading}
            >
              {isUploading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
