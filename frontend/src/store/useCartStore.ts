// frontend/src/store/useCartStore.ts
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { 
  addToCart as apiAddToCart, 
  removeFromCart as apiRemoveFromCart, 
  getCart as apiGetCart,
  clearCart as apiClearCart
} from '@/lib/api';

export interface CartItem {
  product_id: number | string;
  product_name: string;
  display_price: number;
  discount_price: number;
  product_image: string;
  quantity: number; 
}

interface CartState {
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (product_id: number | string) => Promise<void>;
  updateQuantity: (product_id: number | string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  
  fetchCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    try {
      const data = await apiGetCart();
      // Map backend cart format to frontend format
      if (data && data.cart) {
        const formattedCart = data.cart.map((c: any) => ({
          product_id: c.product.product_id,
          product_name: c.product.name,
          display_price: c.product.price,
          discount_price: c.product.discount_price,
          product_image: c.product.image_url,
          quantity: c.cart_quantity
        }));
        set({ cart: formattedCart });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  },

  addToCart: async (item) => {
    const { isAuthenticated } = useAuthStore.getState();
    const state = get();
    const existingItem = state.cart.find((i) => i.product_id === item.product_id);
    
    // Optimistic UI update
    if (existingItem) {
      set({
        cart: state.cart.map((i) =>
          i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      });
    } else {
      set({ cart: [...state.cart, { ...item, quantity: item.quantity }] });
    }

    // Backend sync
    if (isAuthenticated) {
      try {
        await apiAddToCart({ productId: item.product_id, quantity: item.quantity });
      } catch (error) {
        console.error("Failed to sync add to cart:", error);
        // Rollback could be implemented here
      }
    }
  },

  removeFromCart: async (product_id) => {
    const { isAuthenticated } = useAuthStore.getState();
    
    // Optimistic UI update
    set((state) => ({
      cart: state.cart.filter((item) => item.product_id !== product_id),
    }));

    // Backend sync
    if (isAuthenticated) {
      try {
        await apiRemoveFromCart({ productId: product_id });
      } catch (error) {
        console.error("Failed to sync remove from cart:", error);
      }
    }
  },

  updateQuantity: async (product_id, quantity) => {
    const { isAuthenticated } = useAuthStore.getState();
    const state = get();
    const item = state.cart.find(i => i.product_id === product_id);
    
    if (!item) return;

    const newQuantity = Math.max(1, quantity);
    const difference = newQuantity - item.quantity;
    
    if (difference === 0) return;

    // Optimistic UI update
    set((state) => ({
      cart: state.cart.map((i) =>
        i.product_id === product_id ? { ...i, quantity: newQuantity } : i
      ),
    }));

    // Backend sync
    if (isAuthenticated) {
      try {
        // Backend addToCart is additive, so we send the difference
        await apiAddToCart({ productId: product_id, quantity: difference });
      } catch (error) {
        console.error("Failed to sync update quantity:", error);
      }
    }
  },

  clearCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    
    // Optimistic UI update
    set({ cart: [] });

    // Backend sync
    if (isAuthenticated) {
      try {
        await apiClearCart();
      } catch (error) {
        console.error("Failed to sync clear cart:", error);
      }
    }
  },
}));
