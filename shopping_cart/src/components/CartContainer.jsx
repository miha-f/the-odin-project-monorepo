import { useState } from 'react';
import CartButton from "./CartButton.jsx";
import CartDropdown from "./CartDropdown.jsx";

const CartContainer = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Apple', quantity: 2 },
        { id: 2, name: 'Banana', quantity: 1 },
        { id: 19, name: 'Long Name For Banana Is Now Even Longer', quantity: 1 },
        { id: 3, name: 'Apple', quantity: 2 },
        { id: 4, name: 'Apple', quantity: 2 },
        { id: 5, name: 'Apple', quantity: 2 },
        { id: 6, name: 'Apple', quantity: 2 },
        { id: 7, name: 'Apple', quantity: 2 },
        { id: 8, name: 'Apple', quantity: 2 },
        { id: 9, name: 'Apple', quantity: 2 },
        { id: 10, name: 'Apple', quantity: 2 },
        { id: 11, name: 'Banana', quantity: 1 },
        { id: 12, name: 'Banana', quantity: 1 },
        { id: 13, name: 'Banana', quantity: 1 },
        { id: 14, name: 'Banana', quantity: 1 },
        { id: 15, name: 'Banana', quantity: 1 },
        { id: 16, name: 'Banana', quantity: 1 },
        { id: 17, name: 'Banana', quantity: 1 },
        { id: 18, name: 'Banana', quantity: 1 },
    ]);

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const closeDropdown = () => setShowDropdown(false);

    const handleIncrement = (id) => {
        setCartItems((items) =>
            items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
        );
    };

    const handleDecrement = (id) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const handleRemove = (id) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const handleCheckout = () => {
        alert("Go to checkout page");
    };

    return (
        <div>
            <div className="relative">
                <CartButton itemCount={cartItems.length} onClick={toggleDropdown} />
                {showDropdown && (
                    <CartDropdown
                        items={cartItems}
                        onClose={closeDropdown}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        onRemove={handleRemove}
                        onCheckout={handleCheckout}
                    />
                )}
            </div>
        </div>
    );
}

export default CartContainer;
