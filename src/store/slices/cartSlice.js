// Fix #9: Removed dead server-cart async thunks (fetchCart, syncAddToCart,
// syncUpdateCart, syncRemoveFromCart, syncClearCart). No /cart API routes
// exist on the backend — the app uses redux-persist (localStorage) for cart.
// Keeping these caused confusion and added unused bundle weight.
import { createSlice } from "@reduxjs/toolkit";

// ── Slice ──

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      // Same product with a different size = separate cart entry
      const existingItem = state.cart.find(
        (item) =>
          item.product.id === product.id &&
          item.product.selectedSize === product.selectedSize
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    removeFromCart: (state, action) => {
      const { productId, selectedSize } = action.payload;
      state.cart = state.cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.product.selectedSize === selectedSize
          )
      );
    },
    updateCartQuantity: (state, action) => {
      const { productId, selectedSize, quantity } = action.payload;
      const item = state.cart.find(
        (item) =>
          item.product.id === productId &&
          item.product.selectedSize === selectedSize
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
