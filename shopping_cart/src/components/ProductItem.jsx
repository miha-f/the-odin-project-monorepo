import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {

    const addToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("click add to cart");
    }

    return (
        <Link to={`/product/${product.id}`} >
            <div className="max-w-sm h-120 rounded-2xl overflow-hidden shadow-md border border-gray-800 bg-white flex flex-col hover:shadow-gray-800/80">
                <img
                    className="w-full h-64 object-contain p-4"
                    src={product.image}
                    alt={product.title}
                />
                <div className="flex-1 p-4 flex flex-col gap-2">
                    <h2 className="h-1/3 text-lg font-semibold line-clamp-2" title={product.title}>{product.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2" title={product.description}>{product.description}</p>
                    <div className="flex justify-between mt-auto">
                        <span className="text-xl font-bold text-green-600">${product.price}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-800">
                            <FaStar /> {product.rating.rate}
                            <span className="text-gray-400">({product.rating.count})</span>
                        </div>
                    </div>
                    <button onClick={(e) => addToCart(e)} className="mt-auto text-white bg-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-500">
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link >
    );
}

export default ProductItem;
