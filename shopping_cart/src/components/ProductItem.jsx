import { FaStar } from "react-icons/fa";

const ProductItem = ({ product }) => {
    return (
        <div className="max-w-sm rounded-2xl overflow-hidden shadow-md border border-gray-800 bg-white flex flex-col">
            <img
                className="w-full h-64 object-contain p-4"
                src={product.image}
                alt={product.title}
            />
            <div className="flex-1 p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold line-clamp-2" title={product.title}>{product.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-green-600">${product.price}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-800">
                        <FaStar /> {product.rating.rate}
                        <span className="text-gray-400">({product.rating.count})</span>
                    </div>
                </div>
                <button className="mt-auto text-white bg-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-500">
                    Add to Cart
                </button>
            </div>
        </div>

    );
}

export default ProductItem;
