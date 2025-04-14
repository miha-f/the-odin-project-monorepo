import { useEffect, useState } from "react";
import { useGetAllPokemons, getPokemonImageUrl } from "./api.js";
import Header from './Header';
import ImageGrid from './ImageGrid';

const Game = () => {
    const [bestScore, setBestScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [clickedPokemonsSet, setClickedPokemonsSet] = useState(new Set());
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

    const handleClick = (name) => {
        if (clickedPokemonsSet.has(name))
            console.log("you already clicked pokemon: ", name);
        else
            console.log(name);
        setClickedPokemonsSet((prevSet) => new Set(prevSet).add(name));
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    return (
        <>
            <Header>
                <p>Best score: {bestScore}</p>
                <p>Current score: {currentScore}</p>
            </Header>
            <ImageGrid images={images} onClick={handleClick} />
        </>
    );

}

export default Game;
