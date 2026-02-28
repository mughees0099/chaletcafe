"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    src: string;
    alt: string;
    caption: string;
  } | null;
}

export default function GalleryModal({
  isOpen,
  onClose,
  image,
}: GalleryModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
        <DialogTitle className="sr-only">Image Modal</DialogTitle>
        <div className="relative bg-white rounded-lg overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full z-10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-h-[80vh] overflow-hidden">
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full  transition-transform duration-500"
              style={{ maxHeight: "80vh", objectFit: "fill" }}
            />
          </div>
          <div className="p-4 bg-white">
            <p className="text-lg font-medium">{image.alt}</p>
            <p className="text-gray-600">{image.caption}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
