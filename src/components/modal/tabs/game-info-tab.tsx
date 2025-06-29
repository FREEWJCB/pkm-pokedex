"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "../loading-spinner"
import type { ProcessedGameInfo } from "../../../types/processed"

interface GameInfoTabProps {
  gameInfo: ProcessedGameInfo[]
  loading: boolean
}

export const GameInfoTab = ({ gameInfo, loading }: GameInfoTabProps) => {
  if (loading) {
    return <LoadingSpinner message="Loading game information..." />
  }

  if (gameInfo.length === 0) {
    return (
      <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          🎮
        </motion.div>
        <div className="text-gray-500 text-lg mb-2">No Game Information</div>
        <div className="text-gray-400 text-sm">Game descriptions are not available for this Pokémon</div>
      </motion.div>
    )
  }

  // Group by generation for better organization
  const groupedByGeneration = gameInfo.reduce(
    (acc, info) => {
      // Determine generation based on game version
      let generation = "Unknown"
      const version = info.version.toLowerCase()

      if (["red", "blue", "yellow"].includes(version)) generation = "Generation I"
      else if (["gold", "silver", "crystal"].includes(version)) generation = "Generation II"
      else if (["ruby", "sapphire", "emerald"].includes(version)) generation = "Generation III"
      else if (["diamond", "pearl", "platinum"].includes(version)) generation = "Generation IV"
      else if (["black", "white", "black-2", "white-2"].includes(version)) generation = "Generation V"
      else if (["x", "y"].includes(version)) generation = "Generation VI"
      else if (["sun", "moon", "ultra-sun", "ultra-moon"].includes(version)) generation = "Generation VII"
      else if (["sword", "shield"].includes(version)) generation = "Generation VIII"
      else if (["scarlet", "violet"].includes(version)) generation = "Generation IX"
      else generation = "Other Games"

      if (!acc[generation]) {
        acc[generation] = []
      }
      acc[generation].push(info)
      return acc
    },
    {} as Record<string, ProcessedGameInfo[]>,
  )

  const getGameIcon = (version: string) => {
    const v = version.toLowerCase()
    if (["red", "blue", "yellow"].includes(v)) return "🔴"
    if (["gold", "silver", "crystal"].includes(v)) return "🥇"
    if (["ruby", "sapphire", "emerald"].includes(v)) return "💎"
    if (["diamond", "pearl", "platinum"].includes(v)) return "💍"
    if (["black", "white", "black-2", "white-2"].includes(v)) return "⚫"
    if (["x", "y"].includes(v)) return "❌"
    if (["sun", "moon", "ultra-sun", "ultra-moon"].includes(v)) return "☀️"
    if (["sword", "shield"].includes(v)) return "⚔️"
    if (["scarlet", "violet"].includes(v)) return "🌹"
    return "🎮"
  }

  const getGameColor = (version: string) => {
    const v = version.toLowerCase()
    if (v.includes("red") || v.includes("ruby") || v.includes("scarlet"))
      return "bg-red-100 border-red-200 text-red-800"
    if (v.includes("blue") || v.includes("sapphire")) return "bg-blue-100 border-blue-200 text-blue-800"
    if (v.includes("yellow") || v.includes("gold")) return "bg-yellow-100 border-yellow-200 text-yellow-800"
    if (v.includes("silver") || v.includes("pearl")) return "bg-gray-100 border-gray-200 text-gray-800"
    if (v.includes("crystal") || v.includes("diamond")) return "bg-cyan-100 border-cyan-200 text-cyan-800"
    if (v.includes("emerald")) return "bg-green-100 border-green-200 text-green-800"
    if (v.includes("platinum")) return "bg-slate-100 border-slate-200 text-slate-800"
    if (v.includes("black")) return "bg-gray-50 border-gray-700 text-gray-800"
    if (v.includes("white")) return "bg-gray-50 border-gray-200 text-gray-800"
    if (v.includes("violet")) return "bg-purple-100 border-purple-200 text-purple-800"
    return "bg-blue-100 border-blue-200 text-blue-800"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🎮</span>
        <h3 className="text-lg font-bold text-gray-800">Game Information</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByGeneration).map(([generation, games], genIndex) => (
          <motion.div
            key={generation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: genIndex * 0.2 }}
          >
            <motion.h4
              className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-xl">🏆</span>
              {generation}
              <span className="text-sm text-gray-500 font-normal">({games.length} games)</span>
            </motion.h4>

            <div className="grid gap-4">
              {games.map((info, index) => (
                <motion.div
                  key={`${info.version}-${index}`}
                  className={`${getGameColor(info.version)} border rounded-lg p-4`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: genIndex * 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getGameIcon(info.version)}</span>
                    <div>
                      <h5 className="font-bold text-lg capitalize">Pokémon {info.game}</h5>
                      <div className="text-sm opacity-75 capitalize">Version: {info.version.replace("-", " ")}</div>
                    </div>
                  </div>

                  <motion.div
                    className="bg-white bg-opacity-50 rounded-lg p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: genIndex * 0.2 + index * 0.1 + 0.3 }}
                  >
                    <p className="text-sm leading-relaxed">{info.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Info Tips */}
      <motion.div
        className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <h4 className="font-semibold text-indigo-800">About Pokédex Entries</h4>
        </div>
        <ul className="text-indigo-700 text-sm space-y-1">
          <li>• Each game version may have different Pokédex descriptions</li>
          <li>• Descriptions often reflect the Pokémon&apos;s behavior, habitat, and abilities</li>
          <li>• Some entries contain lore and backstory about the Pokémon</li>
          <li>• Newer games may have updated or expanded descriptions</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
