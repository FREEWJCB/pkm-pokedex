"use client"

import type { Pokemon } from "../types/pokemon"

interface SurpriseButtonProps {
  pokemonList: Pokemon[]
  onPokemonSelect: (pokemon: Pokemon) => void
}

export const SurpriseButton = ({ pokemonList, onPokemonSelect }: SurpriseButtonProps) => {
  const handleSurpriseMe = () => {
    if (pokemonList.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemonList.length)
      const randomPokemon = pokemonList[randomIndex]
      onPokemonSelect(randomPokemon)
    }
  }

  return (
    <button
      onClick={handleSurpriseMe}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
      style={{
        cursor: "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <span className="text-lg">🎲</span>
      <span>Surprise Me!</span>
    </button>
  )
}
