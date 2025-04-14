import { useEffect, useState } from "react";
import { useGetAllPokemons, getPokemonImageUrl } from "./api.js";
import Header from './Header';


const Game = () => {
    const [bestScore, setBestScore] = useState(0);
    const [currScore, setCurrScore] = useState(0);
    const [visibleCount, setVisibleCount] = useState(20);

    const { data, error, loading } = useGetAllPokemons();
    const [images, setImages] = useState({});

    // NOTE(miha): Fetch image urls for pokemons
    useEffect(() => {
        if (!data?.results) return;

        const results = data.results.slice(0, visibleCount);
        const fetchImages = async () => {
            const imageMap = {};

            await Promise.all(results.map(async (pokemon) => {
                if (images[pokemon.name]) return;
                try {
                    const imageUrl = await getPokemonImageUrl(pokemon.url);
                    imageMap[pokemon.name] = imageUrl;
                } catch (e) {
                    console.error("Failed to fetch image for", pokemon.name);
                }
            }));

            setImages(prev => ({ ...prev, ...imageMap }));
        };

        fetchImages();

    }, [data, visibleCount]);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    const visiblePokemons = data.results.slice(0, visibleCount);

    return (
        <>
            <Header>
                <p>123</p>
                <p>345</p>
            </Header>
            <div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {visiblePokemons.map((pokemon) => (
                        <div key={pokemon.name} style={{ margin: 10 }}>
                            <p>{pokemon.name}</p>
                            {images[pokemon.name]
                                ? <img src={images[pokemon.name]} alt={pokemon.name} width={96} />
                                : <p>Loading image...</p>}
                        </div>
                    ))}
                </div>
                <button onClick={() => setVisibleCount(count => count + 20)}>
                    Load More
                </button>
            </div>
        </>
    );

}

export default Game;
