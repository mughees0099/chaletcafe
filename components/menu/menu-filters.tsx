"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cake, Pizza } from "lucide-react";
import { FaCookie, FaHamburger } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBreadSlice } from "@fortawesome/free-solid-svg-icons";

interface MenuFiltersProps {
  availableCategories: string[];
}

const categoryIcons: { [key: string]: JSX.Element } = {
  Pizza: <Pizza className="mr-2 h-4 w-4" />,
  Burgers: <FaHamburger className="mr-2 h-4 w-4" />,
  Pasta: <FontAwesomeIcon icon={faUtensils} className="mr-2 h-4 w-4" />,
  Panini: <FontAwesomeIcon icon={faBreadSlice} className="mr-2 h-4 w-4" />,
  Snacks: <FaCookie className="mr-2 h-4 w-4" />,
  Desserts: <Cake className="mr-2 h-4 w-4" />,
  "Desserts & Pastries": <Cake className="mr-2 h-4 w-4" />,
};

export default function MenuFilters({ availableCategories }: MenuFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const scrollToSection = (id: string) => {
    if (id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setActiveFilter(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          className={
            activeFilter === "all" ? "bg-primary hover:bg-primary/90" : ""
          }
          onClick={() => scrollToSection("all")}
        >
          All Items
        </Button>
        {availableCategories.map((category) => (
          <Button
            key={category}
            variant={activeFilter === category ? "default" : "outline"}
            className={
              activeFilter === category ? "bg-primary hover:bg-primary/90" : ""
            }
            onClick={() => scrollToSection(category)}
          >
            {categoryIcons[category] || null}
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
