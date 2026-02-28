"use client";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { EditMenuItemDialog } from "./edit-menu-item-dialog";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  description?: string;
  [key: string]: any;
};

export function MenuItemsTable() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/Products");
        if (response.status !== 200) {
          throw new Error("Failed to fetch menu items");
        }
        setMenuItems(response.data);
      } catch (err) {
        toast.error("Failed to load menu items. Please reload the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [reloadKey]);

  const filteredItems = menuItems.filter(
    (item) =>
      item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateMenuPDF = () => {
    const availableItems = menuItems.filter((item) => item.available);

    if (availableItems.length === 0) {
      toast.error("No available menu items to export!");
      return;
    }

    const menuWindow = window.open("", "_blank");
    if (!menuWindow) {
      toast.error("Please allow popups to generate the menu PDF");
      return;
    }

    // Group items by category
    const itemsByCategory = availableItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    const menuHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chalet Cafe - Menu</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        
        .menu-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          display: flex;
          min-height: 1000px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border-radius: 10px;
          overflow: hidden;
        }
        
        .menu-left {
          background: #2d2d2d;
          width: 300px;
          padding: 40px 30px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .menu-title {
          color: #ffd700;
          font-size: 36px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .menu-subtitle {
          color: white;
          font-size: 16px;
          text-align: center;
          margin-bottom: 40px;
          font-style: italic;
        }
        
        .food-illustrations {
          color: white;
          font-size: 120px;
          text-align: center;
          line-height: 0.8;
          opacity: 0.3;
          margin: 20px 0;
        }
        
        .chalk-drawings {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px, 70px 70px;
        }
        
        .menu-right {
          background: #ffd700;
          flex: 1;
          padding: 40px 35px;
          position: relative;
        }
        
        .category-section {
          margin-bottom: 35px;
        }
        
        .category-title {
          font-size: 20px;
          font-weight: bold;
          color: #2d2d2d;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 2px solid #2d2d2d;
          padding-bottom: 5px;
        }
        
        .menu-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px dotted rgba(45,45,45,0.3);
        }
        
        .item-info {
          flex: 1;
          margin-right: 15px;
        }
        
        .item-name {
          font-size: 16px;
          font-weight: bold;
          color: #2d2d2d;
          margin-bottom: 3px;
          line-height: 1.2;
        }
        
        .item-description {
          font-size: 12px;
          color: #555;
          line-height: 1.3;
          font-style: italic;
        }
        
        .item-price {
          font-size: 16px;
          font-weight: bold;
          color: #2d2d2d;
          white-space: nowrap;
        }
        
        .menu-footer {
          position: absolute;
          bottom: 20px;
          left: 35px;
          right: 35px;
          text-align: center;
          font-size: 12px;
          color: #2d2d2d;
          border-top: 1px solid rgba(45,45,45,0.3);
          padding-top: 15px;
        }
        
        .contact-info {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .generation-date {
          font-size: 10px;
          opacity: 0.7;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .menu-container {
            box-shadow: none;
            border-radius: 0;
            max-width: none;
            width: 100%;
            height: 100vh;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      </style>
    </head>
    <body>
      <div class="menu-container">
        <div class="menu-left">
          <div class="chalk-drawings"></div>
          <div class="menu-title">Menu</div>
          <div class="menu-subtitle">Chalet Cafe</div>
          <div class="food-illustrations">
            🍕<br>
            🍔<br>
            ☕<br>
            🥗<br>
            🍰
          </div>
        </div>
        
        <div class="menu-right">
          ${Object.entries(itemsByCategory)
            .map(
              ([category, items]) => `
            <div class="category-section">
              <h2 class="category-title">${category}</h2>
              ${items
                .map(
                  (item) => `
                <div class="menu-item">
                  <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    ${
                      item.description
                        ? `<div class="item-description">${item.description}</div>`
                        : ""
                    }
                  </div>
                  <div class="item-price">Rs. ${item.price}</div>
                </div>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
          
          <div class="menu-footer">
            <div class="contact-info">
              📧 info@chaletcafe.com | 📞 +92-XXX-XXXXXXX
            </div>
            <div class="generation-date">
              Generated on ${new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `;

    menuWindow.document.write(menuHTML);
    menuWindow.document.close();

    toast.success(
      `Menu PDF generated with ${availableItems.length} available items!`
    );
  };

  const handleAvailabilityToggle = async (_id: string, newValue: boolean) => {
    try {
      const response = await axios.patch("/api/Products", {
        id: _id,
        available: newValue,
        name: menuItems.find((item) => item._id === _id)?.name,
        price: menuItems.find((item) => item._id === _id)?.price,
        category: menuItems.find((item) => item._id === _id)?.category,
        description: menuItems.find((item) => item._id === _id)?.description,
        image: menuItems.find((item) => item._id === _id)?.image,
      });
      if (response.status === 200) {
        toast.success("Menu item availability updated successfully!");
        setReloadKey((prev) => prev + 1);
      } else {
        throw new Error("Failed to update availability");
      }
    } catch (error) {
      console.log("Error updating availability:", error);
      toast.error("Failed to update menu item availability. Please try again.");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedItem: any) => {
    try {
      const response = await axios.patch("/api/Products", updatedItem);
      if (response.status === 200) {
        toast.success("Menu item updated successfully!");
        setReloadKey((prev) => prev + 1);
      }
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Failed to update menu item. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/Products?id=${id}`);
      if (response.status === 200) {
        toast.success("Menu item deleted successfully!");
        setReloadKey((prev) => prev + 1);
      } else {
        throw new Error("Failed to delete menu item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item. Please try again.");
    } finally {
      setShowDeleteDialog(false);
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Menu Items</CardTitle>
            <CardDescription className="text-base mt-1">
              Manage your cafe's menu items and availability
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generateMenuPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export Menu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-10 h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Image</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Available</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                      <span className="text-gray-500">
                        Loading menu items...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50">
                    <TableCell>
                      <img
                        src={
                          item.image || "/placeholder.svg?height=80&width=80"
                        }
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover border"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.svg?height=80&width=80";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-semibold">
                      Rs. {item.price}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.available}
                        onCheckedChange={(checked) =>
                          handleAvailabilityToggle(item._id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setItemToDelete(item);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No menu items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredItems.length}</strong> of{" "}
            <strong>{menuItems.length}</strong> items
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent"
            >
              1
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      {editingItem && (
        <EditMenuItemDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          item={{
            ...editingItem,
            description: editingItem.description ?? "",
            image: editingItem.image ?? "",
            featured: editingItem.featured ?? false,
          }}
          onSave={handleSaveEdit}
        />
      )}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot
              be undone.
              <br />
              <strong className="text-red-600">
                This will permanently remove the item from your menu.
              </strong>
              <br />
              Please confirm that you want to proceed with this action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(itemToDelete?._id || "")}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
