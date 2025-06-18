export type Menu = {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  category: {
    id: number;
    name: string;
    order: number;
  };
};