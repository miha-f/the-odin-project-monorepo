import { createContext, useContext, useState } from 'react';

const CartContext = createContext({ cartItems: [] });

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    console.log("cartItems: ", cartItems);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const increment = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
            )
        );
    };

    const decrement = (id) => {
        setCartItems(prev =>
            prev
                .map(item =>
                    item.id === id
                        ? { ...item, quantity: (item.quantity ?? 1) - 1 }
                        : item
                )
                .filter(item => (item.quantity ?? 1) > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addToCart, removeFromCart, increment, decrement, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

