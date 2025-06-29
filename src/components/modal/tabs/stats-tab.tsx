"use client"

import { motion } from "framer-motion"
import { TrendingUpIcon, TrendingDownIcon } from "../../icons"
import { getTypeColor } from "../../../utils/pokemon-types"
import type { Pokemon } from "../../../types/pokemon"

interface StatsTabProps {
  pokemon: Pokemon
  isLegendary: boolean
}

const getStatRating = (value: number, statName: string) => {
  let thresholds: { low: number; high: number }

  switch (statName) {
    case "hp":
      thresholds = { low: 60, high: 100 }
      break
    case "attack":
    case "defense":
    case "special-attack":
    case "special-defense":
      thresholds = { low: 70, high: 110 }
      break
    case "speed":
      thresholds = { low: 60, high: 100 }
      break
    default:
      thresholds = { low: 70, high: 110 }
  }

  if (value > thresholds.high) {
    return { color: "text-green-600", bg: "bg-green-100", rating: "high", icon: TrendingUpIcon }
  } else if (value < thresholds.low) {
    return { color: "text-red-600", bg: "bg-red-100", rating: "low", icon: TrendingDownIcon }
  } else {
    return { color: "text-yellow-600", bg: "bg-yellow-100", rating: "medium", icon: null }
  }
}

export const StatsTab = ({ pokemon, isLegendary }: StatsTabProps) => {
  const primaryType = pokemon.types[0]?.type.name || "normal"
  const typeColor = getTypeColor(primaryType)

  const statsData = pokemon.stats.map((stat) => {
    const rating = getStatRating(stat.base_stat, stat.stat.name)
    return {
      stat: stat.stat.name.replace("-", " "),
      value: stat.base_stat,
      percentage: Math.min((stat.base_stat / 255) * 100, 100),
      rating: rating.rating,
      color: rating.color,
      bg: rating.bg,
      icon: rating.icon,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">📊</span>
        <h3 className="text-base sm:text-lg font-bold text-gray-800">Base Statistics</h3>
        {isLegendary && (
          <motion.span
            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold"
            animate={{ scale: [1, 1.05] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            Legendary Stats!
          </motion.span>
        )}
      </div>

      {/* RESPONSIVE STATS GRID */}
      <div className="space-y-3 sm:space-y-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.stat}
              className="bg-gray-50 rounded-lg p-3 sm:p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize text-gray-700 text-sm sm:text-base">{stat.stat}</span>
                  {Icon && <Icon />}
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    className={`font-bold text-base sm:text-lg ${stat.color}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                  <motion.span
                    className={`text-xs px-2 py-1 rounded-full font-bold ${stat.bg} ${stat.color}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {stat.rating.toUpperCase()}
                  </motion.span>
                </div>
              </div>

              {/* Progress Bar - Responsive */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                <motion.div
                  className="h-3 sm:h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ backgroundColor: typeColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  {stat.rating === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        repeatType: "reverse",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{stat.percentage.toFixed(1)}%</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
