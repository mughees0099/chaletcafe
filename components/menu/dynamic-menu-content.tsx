"use client";

import { useState, useEffect } from "react";
import MenuSection from "./menu-section";
import MenuFilters from "./menu-filters";
import axios from "axios";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface GroupedMenuItems {
  [category: string]: MenuItem[];
}

const categoryDescriptions: { [key: string]: string } = {
  Pizza: "Delicious pizzas made with fresh ingredients and unique toppings",
  Burgers: "Juicy burgers with a variety of toppings and sides",
  Pasta: "Tasty pasta dishes with a range of sauces and ingredients",
  Panini: "Grilled panini sandwiches with a variety of fillings",
  Snacks: "Light bites and snacks to complement your meal",
  Desserts: "Sweet treats and indulgent desserts to satisfy your cravings",
  "Desserts & Pastries":
    "Sweet treats and indulgent desserts to satisfy your cravings",
};

export default function DynamicMenuContent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedMenuItems>({});
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/Products");
        const data: MenuItem[] = response.data;

        // Group items by category
        const grouped = data.reduce((acc: GroupedMenuItems, item) => {
          const category = item.category || "Other";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});

        // Get categories that have items
        const categories = Object.keys(grouped).filter(
          (category) => grouped[category].length > 0
        );

        setMenuItems(data);
        setGroupedItems(grouped);
        setAvailableCategories(categories);
        setError(null);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No menu items available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <MenuFilters availableCategories={availableCategories} />
      <div className="mt-12">
        {availableCategories.map((category) => (
          <MenuSection
            key={category}
            title={category}
            id={category}
            description={
              categoryDescriptions[category] ||
              `Delicious ${category.toLowerCase()} options`
            }
            items={groupedItems[category]}
          />
        ))}
      </div>
    </>
  );
}
