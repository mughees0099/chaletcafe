"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string, file?: File) => void; // Make sure this matches
  onFileSelect?: (file: File | null) => void;
  resetTrigger?: number;
}

export function ImageUpload({
  currentImage,
  onImageChange,
  onFileSelect,
  resetTrigger,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resetTrigger) {
      handleRemoveImage();
    }
  }, [resetTrigger]);

  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const preview = createPreviewUrl(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
    setError(false);

    // Pass both preview URL and file to parent
    onImageChange(preview, file);

    if (onFileSelect) {
      onFileSelect(file);
    }
    console.log("File selected:", file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const preview = createPreviewUrl(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
    setError(false);

    // Pass both preview URL and file to parent
    onImageChange(preview, file);

    if (onFileSelect) {
      onFileSelect(file);
    }
    console.log("File dropped:", file.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setSelectedFile(null);

    // Pass empty string and undefined file to parent
    onImageChange("", undefined);

    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No image selected</p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleUploadClick}
        className="w-full bg-transparent"
      >
        <Upload className="h-4 w-4 mr-2" />
        {previewUrl ? "Change Image" : "Upload Image"}
      </Button>
    </div>
  );
}
