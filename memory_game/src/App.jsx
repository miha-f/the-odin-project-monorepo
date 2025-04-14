import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Game from './Game'

// TODO:
//  - need to fetch pokemons and its images
//  - need to have game that keeps track of clicked pokemons
//  - need to have functionality to fetch more data if user already gueseed all
//  - Components: Game, PokemonCard

function App() {
    return (
        <Game />
    )
}

export default App
