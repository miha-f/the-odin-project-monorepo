import { useGetAllProducts } from "../api/Products";
import ProductItem from "./ProductItem";

const ProductList = () => {

    const { data, loading, error } = useGetAllProducts();

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    return (
        <>
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">Our Products</h1>
                <div className="grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {data.map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default ProductList;
