"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { POKEMON_REGIONS } from "../utils/pokemon-regions"

interface RegionNavigationProps {
  activeRegion: string
  onRegionChange: (regionId: string) => void
}

export const RegionNavigation = ({ activeRegion, onRegionChange }: RegionNavigationProps) => {
  return (
    <div className="pokemon-header-bg border-b">
      {/* Pokemon Logo */}
      <div className="text-center py-4">
        <motion.h1
          className="text-3xl font-bold text-gray-800"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pokédex Regional
        </motion.h1>
        <motion.p
          className="text-gray-700 text-sm mt-1 font-medium"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explora Pokémon por región
        </motion.p>
      </div>

      {/* Region Navigation */}
      <div className="overflow-x-auto">
        <div className="flex justify-center min-w-max px-4 pb-4">
          <div className="flex gap-2">
            {POKEMON_REGIONS.map((region, index) => (
              <motion.button
                key={region.id}
                onClick={() => onRegionChange(region.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 min-w-[100px] cursor-pointer border-2 group ${
                  activeRegion === region.id
                    ? "bg-red-500 text-white shadow-lg scale-105 border-red-600"
                    : "bg-white text-gray-700 shadow-md border-gray-200 hover:bg-red-400 hover:text-white hover:border-red-500 hover:shadow-xl hover:scale-105"
                }`}
                style={{ cursor: "pointer" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.08,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Region Shield */}
                <motion.div
                  className="relative w-12 h-12 mb-2"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={region.image || "/placeholder.svg"}
                    alt={`${region.name} region`}
                    fill
                    className="object-contain transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg"
                  />
                </motion.div>

                {/* Region Info */}
                <div className="text-center">
                  <motion.div
                    className="font-bold text-sm transition-all duration-300"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      textShadow: activeRegion === region.id ? "1px 1px 2px rgba(0, 0, 0, 0.3)" : "none",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {region.name}
                  </motion.div>
                  <motion.div
                    className="text-xs opacity-75 transition-all duration-300"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      textShadow: activeRegion === region.id ? "1px 1px 2px rgba(0, 0, 0, 0.3)" : "none",
                    }}
                  >
                    Gen {region.generation}
                  </motion.div>
                  <motion.div
                    className="text-xs opacity-75 transition-all duration-300"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      textShadow: activeRegion === region.id ? "1px 1px 2px rgba(0, 0, 0, 0.3)" : "none",
                    }}
                  >
                    #{region.startId}-{region.endId}
                  </motion.div>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-red-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                {/* Active State Glow */}
                {activeRegion === region.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-red-700/30 via-red-600/20 to-transparent rounded-lg pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Hover Sparkle Effect */}
                <motion.div
                  className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
