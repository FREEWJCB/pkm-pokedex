"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Pokemon } from "../types/pokemon"
import { getTypeColor } from "../utils/pokemon-types"

interface PokemonCardProps {
  pokemon: Pokemon
  onClick?: (pokemon: Pokemon) => void
  index?: number
}

export const PokemonCard = ({ pokemon, onClick, index = 0 }: PokemonCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Simple intersection observer implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleClick = () => {
    onClick?.(pokemon)
  }

  const primaryType = pokemon.types[0]?.type.name || "normal"
  const typeColor = getTypeColor(primaryType)

  // Calculate total stats for the glow effect
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  const isLegendary = totalStats > 600 // Legendary threshold

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group ${
        isLegendary ? "ring-2 ring-yellow-400 ring-opacity-50" : ""
      }`}
      onClick={handleClick}
      style={{
        background: `linear-gradient(135deg, ${typeColor}15 0%, white 50%, ${typeColor}10 100%)`,
      }}
    >
      {/* Legendary glow effect */}
      {isLegendary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-20 rounded-xl"
          animate={{
            opacity: [0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        />
      )}

      {/* Pokemon ID Badge */}
      <motion.div
        className="absolute top-3 right-3 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <div
          className="px-2 py-1 rounded-full text-white text-xs font-bold shadow-lg"
          style={{ backgroundColor: typeColor }}
        >
          #{pokemon.id.toString().padStart(4, "0")}
        </div>
      </motion.div>

      {/* Shiny indicator for special Pokemon */}
      {pokemon.id % 100 === 0 && (
        <motion.div
          className="absolute top-3 left-3 z-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        >
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs">✨</span>
          </div>
        </motion.div>
      )}

      {/* Pokemon Image Container */}
      <div className="relative p-6 pb-4">
        <motion.div
          className="relative w-32 h-32 mx-auto"
          whileHover={{
            scale: 1.1,
            rotate: [-5, 5],
          }}
          transition={{
            duration: 0.5,
            rotate: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 1,
            },
          }}
        >
          {/* Loading skeleton */}
          {!imageLoaded && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
          )}

          <Image
            src={
              imageError
                ? "/placeholder.svg?height=128&width=128"
                : pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default
            }
            alt={pokemon.name}
            fill
            className={`object-contain transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${typeColor}40 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </div>

      {/* Pokemon Info */}
      <div className="px-6 pb-6">
        {/* Pokemon Name */}
        <motion.h3
          className="text-center text-lg font-bold text-gray-800 mb-3 capitalize"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {pokemon.name}
        </motion.h3>

        {/* Pokemon Types */}
        <motion.div
          className="flex justify-center gap-1 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {pokemon.types.map((type, typeIndex) => (
            <motion.span
              key={type.type.name}
              className="px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-md"
              style={{ backgroundColor: getTypeColor(type.type.name) }}
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{
                delay: index * 0.1 + 0.6 + typeIndex * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: `0 4px 20px ${getTypeColor(type.type.name)}40`,
              }}
            >
              {type.type.name}
            </motion.span>
          ))}
        </motion.div>

        {/* Quick Stats Preview */}
        <motion.div
          className="grid grid-cols-3 gap-2 text-center text-xs"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.1 + 0.7 }}
        >
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-500 text-xs">HP</div>
            <div className="font-bold text-gray-800">
              {pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-500 text-xs">ATK</div>
            <div className="font-bold text-gray-800">
              {pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-500 text-xs">DEF</div>
            <div className="font-bold text-gray-800">
              {pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hover overlay */}
      <motion.div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

      {/* Click ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={false}
        whileTap={{
          background: [
            "radial-gradient(circle, transparent 0%, transparent 100%)",
            `radial-gradient(circle, ${typeColor}20 0%, transparent 100%)`,
          ],
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}
