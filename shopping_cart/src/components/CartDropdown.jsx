import { Link } from "react-router-dom";

const CartDropdown = ({ items, onClose, onRemove, onIncrement, onDecrement }) => {
    return (
        <div className="absolute -right-20 sm:right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-200">
                {items.length === 0 ? (
                    <div className="p-4 text-black font-semibold">Your cart is empty</div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="text-black p-4 flex justify-between items-center">
                            <div className="w-1/3">
                                <div className="font-medium text-clamp-1">{item.title}</div>
                                <div className="text-sm text-gray-500">{item.price * item.quantity}$</div>
                            </div>
                            <div className="w-1/3 flex justify-center">
                                <img className="w-[50px] h-[50px]" src={item.image} />
                            </div>
                            <div className="flex gap-2 items-center w-1/3">
                                <button onClick={() => onDecrement(item.id)} className="px-2">-</button>
                                <span className="min-w-4 text-center">{item.quantity}</span>
                                <button onClick={() => onIncrement(item.id)} className="px-2">+</button>
                                <button onClick={() => onRemove(item.id)} className="text-red-500 text-sm">✕</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 flex justify-between">
                <button onClick={onClose} className="text-sm text-white bg-gray-800 px-4 py-1 text-semibold rounded">Continue Shopping</button>
                <Link to="/shop/checkout">
                    <button className="bg-gray-800 text-white text-semibold px-4 py-1 rounded text-sm">
                        Checkout
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default CartDropdown;
