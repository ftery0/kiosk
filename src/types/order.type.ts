import { Menu } from "./menu.type";

export interface OrderItem {
    id: number;
    quantity: number;
    menu: Menu;
  }
  
  export interface Order {
    id: number;
    orderedAt: string;
    items: OrderItem[];
  }