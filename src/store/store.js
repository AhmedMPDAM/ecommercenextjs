import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

function saveCartToStorageInline(cartState, prefer = 'local') {
  try {
    if (typeof window === 'undefined') return;
    const storage = prefer === 'session' ? window.sessionStorage : window.localStorage;
    storage?.setItem('cart', JSON.stringify(cartState));
  } catch {}
}

function clearCartStorageInline(prefer = 'local') {
  try {
    if (typeof window === 'undefined') return;
    const primary = prefer === 'session' ? window.sessionStorage : window.localStorage;
    const secondary = prefer === 'session' ? window.localStorage : window.sessionStorage;
    primary?.removeItem('cart');
    secondary?.removeItem('cart');
  } catch {}
}

const cartPersistMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  try {
    const state = storeApi.getState();
    const cartState = state?.cart;
    if (cartState) {
      if (action.type === 'cart/clearCart') {
        clearCartStorageInline('local');
      } else {
        saveCartToStorageInline(
          {
            items: cartState.items,
            totalQuantity: cartState.totalQuantity,
            totalAmount: cartState.totalAmount,
            loading: false,
            error: null,
          },
          'local'
        );
      }
    }
  } catch {}
  return result;
};

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
         ignoredActions: ['persist/PERSIST'],
      },
    }).concat(cartPersistMiddleware),
});

export default store;