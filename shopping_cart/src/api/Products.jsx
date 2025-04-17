import { useEffect, useState } from 'react';

export const getAllProducts = async () => {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) throw new Error("server error");
    const data = await response.json()
    return data;
}

export const useGetAllProducts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const fetchedData = await getAllProducts();
                setData(fetchedData);
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    return { data, loading, error };
}

export const getProduct = async (id) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`)
    if (!response.ok) throw new Error("server error");
    const data = await response.json()
    return data;
}

export const useGetProduct = (id) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const fetchedData = await getProduct(id);
                setData(fetchedData);
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    return { data, loading, error };
}           
