import { FaShoppingCart } from 'react-icons/fa';

const CartButton = ({ itemCount, onClick }) => {
    return (
        <button onClick={onClick} className="relative p-2">
            <FaShoppingCart className="text-2xl" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-800 font-semibold text-xs px-1.5 rounded-full">
                    {itemCount}
                </span>
            )}
        </button>
    );
}

export default CartButton;
