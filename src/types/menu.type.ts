import { Category } from "./category.type";

export interface Menu {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  category:Category
};