import { useCart } from '@/context/CartContext';

const Checkout = () => {
    const { cartItems, increment, decrement, removeFromCart } = useCart();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">Invoice</h2>

            <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center py-4">
                        <div className="w-1/4">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                        </div>

                        <div className="flex justify-center w-1/4">
                            <img className="w-[50px] h-[50px]" src={item.image} />
                        </div>

                        <div className="w-1/4 flex justify-center items-center gap-2">
                            <button
                                onClick={() => decrement(item.id)}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                −
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                                onClick={() => increment(item.id)}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                +
                            </button>
                        </div>

                        <div className="w-1/4 text-center sm:text-right">
                            <p className="font-medium">${item.price * item.quantity}</p>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 text-sm mt-1"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-right mt-6">
                <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
                <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500">
                    Buy
                </button>
            </div>
        </div>
    );
}

export default Checkout;
