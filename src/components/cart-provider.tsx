"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Course } from "@/types/domain";

type CartContextValue = {
  items: Course[];
  isOpen: boolean;
  addItem: (course: Course) => void;
  removeItem: (courseId: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Course[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo<CartContextValue>(() => ({
    items,
    isOpen,
    addItem: (course) => {
      setItems((current) => current.some((item) => item.id === course.id) ? current : [...current, course]);
      setIsOpen(true);
    },
    removeItem: (courseId) => setItems((current) => current.filter((item) => item.id !== courseId)),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }), [items, isOpen]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
