"use client";

import React, { useEffect, useState } from "react";
import { Category } from "@/types/category.type";
import { fetchCategories } from "@/api/category";

interface NavProps {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number) => void;
}

const Nav = ({ selectedCategoryId, setSelectedCategoryId }: NavProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);

        if (data.length > 0 && selectedCategoryId === null) {
          setSelectedCategoryId(data[0].id);
        }
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, [selectedCategoryId, setSelectedCategoryId]);

  return (
    <nav className="flex justify-center space-x-4 bg-white p-4 border-b">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategoryId(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            selectedCategoryId === category.id
              ? "bg-[var(--primary)] text-white"
              : "bg-gray-100 text-[var(--foreground)]"
          }`}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
};

export default Nav;
