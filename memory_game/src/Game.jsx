import { useEffect, useState } from "react";
import { useGetAllPokemons, getPokemonImageUrl } from "./api.js";
import Header from './Header';
import ImageGrid from './ImageGrid';

const Game = () => {
    const [bestScore, setBestScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [clickedPokemonsSet, setClickedPokemonsSet] = useState(new Set());
    const [visibleCount, setVisibleCount] = useState(20);
    const [playing, setPlaying] = useState(true);
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
        if (clickedPokemonsSet.has(name)) {
            setPlaying(false);
            setBestScore(Math.max(bestScore, currentScore));
            return;
        }

        const guessed = clickedPokemonsSet.size;
        const total = Object.keys(images).length;
        if (guessed / total > 0.5) {
            console.log("adding pokemons");
            setVisibleCount(visibleCount + 20);
        }

        setCurrentScore(currentScore + 1);
        setClickedPokemonsSet((prevSet) => new Set(prevSet).add(name));
    }

    const playAgain = () => {
        setCurrentScore(0);
        setPlaying(true);
    }

    const shuffleAndSliceObject = (obj) => {
        const entries = Object.entries(obj);
        for (let i = entries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
        }
        const shuffled = Object.fromEntries(entries);
        const first20Keys = Object.keys(shuffled).slice(0, 20);
        const slicedObject = first20Keys.reduce((obj, key) => {
            obj[key] = shuffled[key];
            return obj;
        }, {});
        return slicedObject;
    };


    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    const shuffledSlicedImages = shuffleAndSliceObject(images);

    return (
        <>
            <Header>
                <p>Best score: {bestScore}</p>
                <p>Current score: {currentScore}</p>
            </Header>
            {playing ?
                <ImageGrid images={shuffledSlicedImages} onClick={handleClick} />
                : <div>
                    <p>More luck next time</p>
                    <button onClick={playAgain}>Play again</button>
                </div>
            }
        </>
    );

}

export default Game;
