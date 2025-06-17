"use client"
import React from "react";

interface NavProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Nav = ({ selectedCategory, setSelectedCategory }: NavProps) => {
  const categories = ["밥류", "면류", "음료류"];

  return (
    <nav className="flex justify-center space-x-4 bg-white p-4 border-b">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            selectedCategory === category
              ? "bg-[var(--primary)] text-white"
              : "bg-gray-100 text-[var(--foreground)]"
          }`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
};

export default Nav;
