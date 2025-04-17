import { FaStar } from "react-icons/fa";
import { useGetProduct } from "../api/Products";
import { useParams } from "react-router-dom";

const Product = () => {
    const { id } = useParams();
    const { data: product, loading, error } = useGetProduct(id);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    return (
        <>
            <h2 className="text-center h-1/3 text-lg font-semibold" title={product.title}>{product.title}</h2>
            <img
                className="w-full h-64 object-contain p-4"
                src={product.image}
                alt={product.title}
            />
            <div className="flex-1 p-4 flex flex-col gap-2">
                <p className="text-sm text-gray-500" title={product.description}>{product.description}</p>
                <div className="flex justify-evenly mt-auto">
                    <span className="text-xl font-bold text-green-600">${product.price}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-800">
                        <FaStar /> {product.rating.rate}
                        <span className="text-gray-400">({product.rating.count})</span>
                    </div>
                </div>
                <button onClick={(e) => addToCart(e)} className="mx-auto w-40 mt-auto text-white bg-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-500">
                    Add to Cart
                </button>
            </div>
        </>
    );
}

export default Product;
