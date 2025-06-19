import { create } from "zustand";

export type OrderType = "DINE_IN" | "TAKE_OUT";

interface OrderTypeStore {
  orderType: OrderType | null;
  setOrderType: (type: OrderType) => void;
}

export const useOrderTypeStore = create<OrderTypeStore>((set) => ({
  orderType: null,
  setOrderType: (type) => set({ orderType: type }),
}));
