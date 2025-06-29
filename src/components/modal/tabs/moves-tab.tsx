"use client"

import { motion } from "framer-motion"
import { getTypeColor } from "../../../utils/pokemon-types"
import { LoadingSpinner } from "../loading-spinner"
import type { ProcessedMove } from "../../../types/processed"

interface MovesTabProps {
  moves: ProcessedMove[]
  loading: boolean
}

export const MovesTab = ({ moves, loading }: MovesTabProps) => {
  if (loading) {
    return <LoadingSpinner message="Loading moves data..." />
  }

  if (moves.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-gray-500">No moves data available</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚔️</span>
        <h3 className="text-lg font-bold text-gray-800">Moves</h3>
      </div>

      <motion.div
        className="mb-4 p-4 bg-blue-50 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Showing first 20 moves. Move availability may vary by game version.
          <br />
          <strong>Categories:</strong> <span className="text-red-600">Physical</span> (uses Attack),
          <span className="text-blue-600 ml-2">Special</span> (uses Sp. Attack),
          <span className="text-gray-600 ml-2">Status</span> (no damage)
        </p>
      </motion.div>

      <div className="space-y-3">
        {moves.map((move, index) => (
          <motion.div
            key={`${move.name}-${index}`}
            className="bg-gray-50 rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold capitalize text-gray-800">{move.name}</h4>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded text-white text-xs font-bold uppercase"
                  style={{ backgroundColor: getTypeColor(move.type) }}
                >
                  {move.type}
                </span>
                <span
                  className={`capitalize font-medium text-sm ${
                    move.category === "physical"
                      ? "text-red-600"
                      : move.category === "special"
                        ? "text-blue-600"
                        : "text-gray-600"
                  }`}
                >
                  {move.category}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2 text-sm">
              <div>
                <span className="text-gray-500">Power:</span>{" "}
                <span className="font-semibold text-gray-500">{move.power ? move.power : "—"}</span>
              </div>
              <div>
                <span className="text-gray-500">Accuracy:</span>{" "}
                <span className="font-semibold text-gray-500">{move.accuracy ? `${move.accuracy}%` : "—"}</span>
              </div>
              <div>
                <span className="text-gray-500">PP:</span> <span className="font-semibold text-gray-500">{move.pp}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">
                  {move.learnMethod === "level-up"
                    ? "Level Up"
                    : move.learnMethod === "machine"
                      ? "TM/TR"
                      : move.learnMethod === "tutor"
                        ? "Move Tutor"
                        : move.learnMethod === "egg"
                          ? "Egg Move"
                          : move.learnMethod.charAt(0).toUpperCase() + move.learnMethod.slice(1)}
                </span>
                {move.level && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    Lv. {move.level}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{move.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
