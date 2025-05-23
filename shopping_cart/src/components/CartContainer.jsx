import { useState } from 'react';
import CartButton from "./CartButton.jsx";
import CartDropdown from "./CartDropdown.jsx";
import { useCart } from '@/context/CartContext';

const CartContainer = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { cartItems, increment, decrement, removeFromCart } = useCart();

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const closeDropdown = () => setShowDropdown(false);

    return (
        <div>
            <div className="relative">
                <CartButton itemCount={cartItems.length} onClick={toggleDropdown} />
                {showDropdown && (
                    <CartDropdown
                        items={cartItems}
                        onClose={closeDropdown}
                        onIncrement={increment}
                        onDecrement={decrement}
                        onRemove={removeFromCart}
                    />
                )}
            </div>
        </div>
    );
}

export default CartContainer;
