// "use client";

// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// export type CartItem = {
//   productId: number;
//   variantId: number;

//   name: string;
//   team: string;

//   player: string | null;
//   number: number | null;
//   size: string;

//   price: number;
//   image: string;

//   quantity: number;
//   stock: number;
// };

// type CartContextType = {
//   cart: CartItem[];

//   addToCart: (item: CartItem) => void;
//   removeFromCart: (productId: number, variantId: number) => void;
//   increaseQuantity: (productId: number, variantId: number) => void;
//   decreaseQuantity: (productId: number, variantId: number) => void;
//   clearCart: () => void;

//   totalItems: number;
//   totalPrice: number;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [isLoaded, setIsLoaded] = useState(false);

//   // Cargar carrito después de montar en el navegador
//   useEffect(() => {
//     const loadCart = () => {
//       try {
//         const savedCart = localStorage.getItem("cart");

//         if (savedCart) {
//           const parsedCart = JSON.parse(savedCart);

//           if (Array.isArray(parsedCart)) {
//             setCart(parsedCart);
//           }
//         }
//       } catch (error) {
//         console.error("Error cargando el carrito:", error);
//       }

//       setIsLoaded(true);
//     };

//     const timeout = setTimeout(loadCart, 0);

//     return () => clearTimeout(timeout);
//   }, []);

//   // Guardar solamente después de haber cargado localStorage
//   useEffect(() => {
//     if (!isLoaded) return;

//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart, isLoaded]);

//   // Agregar producto
//   const addToCart = (item: CartItem) => {
//     setCart((currentCart) => {
//       const existingItem = currentCart.find(
//         (cartItem) =>
//           cartItem.productId === item.productId &&
//           cartItem.variantId === item.variantId,
//       );

//       if (existingItem) {
//         return currentCart.map((cartItem) => {
//           if (
//             cartItem.productId === item.productId &&
//             cartItem.variantId === item.variantId
//           ) {
//             if (cartItem.quantity >= cartItem.stock) {
//               return cartItem;
//             }

//             return {
//               ...cartItem,
//               quantity: cartItem.quantity + 1,
//             };
//           }

//           return cartItem;
//         });
//       }

//       return [
//         ...currentCart,
//         {
//           ...item,
//           quantity: 1,
//         },
//       ];
//     });
//   };

//   // Eliminar completamente un producto
//   const removeFromCart = (productId: number, variantId: number) => {
//     setCart((currentCart) =>
//       currentCart.filter(
//         (item) =>
//           !(item.productId === productId && item.variantId === variantId),
//       ),
//     );
//   };

//   // Aumentar cantidad
//   const increaseQuantity = (productId: number, variantId: number) => {
//     setCart((currentCart) =>
//       currentCart.map((item) => {
//         if (item.productId === productId && item.variantId === variantId) {
//           if (item.quantity >= item.stock) {
//             return item;
//           }

//           return {
//             ...item,
//             quantity: item.quantity + 1,
//           };
//         }

//         return item;
//       }),
//     );
//   };

//   // Disminuir cantidad
//   const decreaseQuantity = (productId: number, variantId: number) => {
//     setCart((currentCart) =>
//       currentCart
//         .map((item) => {
//           if (item.productId === productId && item.variantId === variantId) {
//             return {
//               ...item,
//               quantity: item.quantity - 1,
//             };
//           }

//           return item;
//         })
//         .filter((item) => item.quantity > 0),
//     );
//   };

//   // Vaciar carrito
//   const clearCart = () => {
//     setCart([]);
//   };

//   // Cantidad total
//   const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

//   // Precio total
//   const totalPrice = cart.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0,
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         increaseQuantity,
//         decreaseQuantity,
//         clearCart,
//         totalItems,
//         totalPrice,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// // Hook para usar el carrito
// export function useCart() {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error("useCart debe utilizarse dentro de CartProvider");
//   }

//   return context;
// }

"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type CartItem = {
  productId: number;
  variantId: number;

  name: string;
  team: string;

  player: string | null;
  number: number | null;
  size: string;

  price: number;
  image: string;

  quantity: number;
  stock: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, variantId: number) => void;
  increaseQuantity: (productId: number, variantId: number) => void;
  decreaseQuantity: (productId: number, variantId: number) => void;
  clearCart: () => void;

  totalItems: number;
  totalPrice: number;
};

type MetaPixelWindow = Window & {
  fbq?: (
    action: string,
    event: string,
    parameters?: Record<string, unknown>,
  ) => void;
};

// Registrar AddToCart en Meta Pixel
function trackAddToCart(item: CartItem) {
  if (typeof window === "undefined") return;

  // Activar únicamente si el visitante ha dado
  // su consentimiento para seguimiento publicitario.
  if (localStorage.getItem("marketing_consent") !== "granted") {
    return;
  }

  const fbq = (window as MetaPixelWindow).fbq;

  if (typeof fbq !== "function") return;

  const contentId = `${item.productId}_${item.variantId}`;

  fbq("track", "AddToCart", {
    content_ids: [contentId],
    content_name: item.name,
    content_type: "product",
    contents: [
      {
        id: contentId,
        quantity: 1,
        item_price: item.price,
      },
    ],
    value: item.price,
    currency: "PEN",
  });
}

const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Referencia para mantener el carrito actualizado
  // incluso si se realizan acciones rápidamente.
  const cartRef = useRef<CartItem[]>([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            cartRef.current = parsedCart;
            setCart(parsedCart);
          }
        }
      } catch (error) {
        console.error("Error cargando el carrito:", error);
      }

      setIsLoaded(true);
    };

    const timeout = setTimeout(loadCart, 0);

    return () => clearTimeout(timeout);
  }, []);

  // Guardar carrito después de cargarlo
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  // Actualizar carrito y referencia
  const updateCart = (updatedCart: CartItem[]) => {
    cartRef.current = updatedCart;
    setCart(updatedCart);
  };

  // Agregar producto al carrito
  const addToCart = (item: CartItem) => {
    // Evitar modificaciones antes de cargar el carrito
    if (!isLoaded) return;

    const currentCart = cartRef.current;

    const existingItem = currentCart.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.variantId === item.variantId,
    );

    // Verificar stock disponible
    if (item.stock <= 0) return;

    if (existingItem) {
      if (existingItem.quantity >= existingItem.stock) {
        return;
      }

      const updatedCart = currentCart.map((cartItem) => {
        if (
          cartItem.productId === item.productId &&
          cartItem.variantId === item.variantId
        ) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        }

        return cartItem;
      });

      updateCart(updatedCart);
    } else {
      const updatedCart = [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];

      updateCart(updatedCart);
    }

    // Registrar únicamente una adición exitosa
    trackAddToCart(item);
  };

  // Eliminar completamente un producto
  const removeFromCart = (
    productId: number,
    variantId: number,
  ) => {
    if (!isLoaded) return;

    const updatedCart = cartRef.current.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.variantId === variantId
        ),
    );

    updateCart(updatedCart);
  };

  // Aumentar cantidad
  const increaseQuantity = (
    productId: number,
    variantId: number,
  ) => {
    if (!isLoaded) return;

    const currentCart = cartRef.current;

    const item = currentCart.find(
      (cartItem) =>
        cartItem.productId === productId &&
        cartItem.variantId === variantId,
    );

    if (!item || item.quantity >= item.stock) return;

    const updatedCart = currentCart.map((cartItem) =>
      cartItem.productId === productId &&
      cartItem.variantId === variantId
        ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          }
        : cartItem,
    );

    updateCart(updatedCart);

    // También registra la unidad agregada con el botón +
    trackAddToCart(item);
  };

  // Disminuir cantidad
  const decreaseQuantity = (
    productId: number,
    variantId: number,
  ) => {
    if (!isLoaded) return;

    const updatedCart = cartRef.current
      .map((item) => {
        if (
          item.productId === productId &&
          item.variantId === variantId
        ) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  // Vaciar carrito
  const clearCart = () => {
    if (!isLoaded) return;

    updateCart([]);
  };

  // Cantidad total de productos
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Precio total del carrito
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook para utilizar el carrito
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider",
    );
  }

  return context;
}
