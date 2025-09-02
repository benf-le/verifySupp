// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    type: string;
    qty: number;
};

type CartState = {
    items: CartItem[];
};

const loadCartFromStorage = (): CartItem[] => {
    try {
        const data = localStorage.getItem("shoppingCart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (cart: CartItem[]) => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
};

const initialState: CartState = {
    items: loadCartFromStorage(),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) => item.name === action.payload.name
            );
            if (existingItem) {
                existingItem.qty += action.payload.qty;
            } else {
                state.items.push(action.payload);
            }
            saveCartToStorage(state.items);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            saveCartToStorage(state.items);
        },
        increaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) {
                item.qty += 1;
            }
            saveCartToStorage(state.items);
        },
        decreaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item && item.qty > 1) {
                item.qty -= 1;
            } else {
                // nếu qty = 1 thì xóa luôn sp
                state.items = state.items.filter((i) => i.id !== action.payload);
            }
            saveCartToStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToStorage([]);
        },

    },
});

export const { addToCart, removeFromCart, clearCart,increaseQty,decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;
