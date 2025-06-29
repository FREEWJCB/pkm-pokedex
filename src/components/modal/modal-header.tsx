"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { getTypeColor } from "../../utils/pokemon-types"
import type { Pokemon } from "../../types/pokemon"

interface ModalHeaderProps {
  pokemon: Pokemon
  onClose: () => void
  isLegendary: boolean
}

export const ModalHeader = ({ pokemon, onClose, isLegendary }: ModalHeaderProps) => {
  const primaryType = pokemon.types[0]?.type.name || "normal"
  const typeColor = getTypeColor(primaryType)

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden"
      style={{ backgroundColor: typeColor }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Legendary glow effect */}
      {isLegendary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-20"
          animate={{ opacity: [0.1, 0.3] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        />
      )}

      {/* Close button - FIXED RESPONSIVE */}
      <motion.button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-white hover:bg-black hover:bg-opacity-20 rounded-full transition-all duration-200 z-20 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
        aria-label="Close modal"
      >
        {/* X Icon - Responsive size */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

        {/* Tooltip - Hidden on mobile */}
        <div className="hidden lg:block absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Close
        </div>
      </motion.button>

      {/* FIXED RESPONSIVE LAYOUT */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 pr-16 sm:pr-20 lg:pr-24 relative z-10">
        {/* Pokemon Image - Responsive */}
        <motion.div
          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 flex-shrink-0 cursor-pointer"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          whileHover={{
            scale: 1.05,
            rotate: [-5, 5],
            transition: {
              rotate: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 0.5,
              },
            },
          }}
        >
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            fill
            className="object-contain drop-shadow-lg"
          />

          {/* Legendary sparkles - Responsive */}
          {isLegendary && (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-yellow-300 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{ scale: [0, 1], opacity: [0, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                    ease: "easeInOut",
                    repeatType: "reverse",
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Pokemon Info - Responsive */}
        <div className="flex-1 text-center sm:text-left">
          <motion.div
            className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            #{pokemon.id.toString().padStart(4, "0")}
            {isLegendary && (
              <motion.span
                className="ml-3 px-2 sm:px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs sm:text-sm font-bold shadow-lg block sm:inline mt-2 sm:mt-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                ✨ LEGENDARY
              </motion.span>
            )}
          </motion.div>

          {/* Name and Types - Responsive */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold capitalize"
              whileHover={{ scale: 1.05 }}
              style={{
                color: "white",
                textShadow: "3px 3px 6px rgba(0, 0, 0, 0.8)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {pokemon.name}
            </motion.h2>
            <div className="flex gap-2 sm:gap-3">
              {pokemon.types.map((type, index) => (
                <motion.span
                  key={type.type.name}
                  className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 rounded-full text-white text-sm sm:text-base lg:text-lg font-bold uppercase tracking-wide shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: getTypeColor(type.type.name),
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {type.type.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Basic Stats Grid - Responsive */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { label: "Height", value: `${(pokemon.height / 10).toFixed(1)}m`, icon: "📏" },
              { label: "Weight", value: `${(pokemon.weight / 10).toFixed(1)}kg`, icon: "⚖️" },
              { label: "Base Exp", value: pokemon.base_experience || "N/A", icon: "⭐" },
              {
                label: "Generation",
                value:
                  pokemon.id <= 151
                    ? "I"
                    : pokemon.id <= 251
                      ? "II"
                      : pokemon.id <= 386
                        ? "III"
                        : pokemon.id <= 493
                          ? "IV"
                          : pokemon.id <= 649
                            ? "V"
                            : pokemon.id <= 721
                              ? "VI"
                              : pokemon.id <= 809
                                ? "VII"
                                : pokemon.id <= 898
                                  ? "VIII"
                                  : "IX",
                icon: "🎮",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="bg-black bg-opacity-20 rounded-lg p-2 sm:p-3 lg:p-4 backdrop-blur-sm cursor-pointer hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div
                  className="text-xs sm:text-sm mb-1 font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <span className="mr-1 text-sm sm:text-base">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
                <div
                  className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold"
                  style={{
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {item.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
