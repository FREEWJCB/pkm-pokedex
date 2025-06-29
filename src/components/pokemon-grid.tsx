"use client"

import { motion } from "framer-motion"
import type { Pokemon } from "../types/pokemon"
import { PokemonCard } from "./pokemon-card"

interface PokemonGridProps {
  pokemon: Pokemon[]
  onPokemonClick: (pokemon: Pokemon) => void
}

export const PokemonGrid = ({ pokemon, onPokemonClick }: PokemonGridProps) => {
  if (pokemon.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          🔍
        </motion.div>
        <div className="text-gray-300 text-lg mb-2">No Pokémon found</div>
        <div className="text-gray-400 text-sm">Try adjusting your search or filters</div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {pokemon.map((poke, index) => (
        <PokemonCard key={poke.id} pokemon={poke} onClick={onPokemonClick} index={index} />
      ))}
    </motion.div>
  )
}
