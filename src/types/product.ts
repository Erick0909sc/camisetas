// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // Ej: "Selecciones" o "Clubes"
  team: string;     // Ej: "Argentina", "Real Madrid"
  images: string[]; // Una lista de imágenes: [0] es la principal/delantera, [1] la trasera, [2] detalles, etc.
  sizes: string[];  // Ej: ["S", "M", "L", "XL"]
  stock: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;    // La imagen que se mostrará en el carrito
  quantity: number;
}