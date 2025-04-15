import { useEffect, useState } from "react";

export const useGetAllPokemons = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {
            const fetchData = async () => {
                try {
                    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
                    if (!response.ok)
                        throw new Error("server error");
                    const data = await response.json();
                    setData({ count: data.count, results: data.results });
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }, []
    );

    return { data, error, loading };
}

export const getPokemonImageUrl = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("server error");
    const data = await response.json();
    return data.sprites.other['official-artwork'].front_default;
};
