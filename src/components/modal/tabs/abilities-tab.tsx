"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "../loading-spinner"
import type { ProcessedAbility } from "../../../types/processed"

interface AbilitiesTabProps {
  abilities: ProcessedAbility[]
  loading: boolean
}

export const AbilitiesTab = ({ abilities, loading }: AbilitiesTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚡</span>
        <h3 className="text-lg font-bold text-gray-800">Abilities</h3>
      </div>
      <div className="space-y-4">
        {abilities.map((ability, index) => (
          <motion.div
            key={ability.name}
            className="bg-gray-50 rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold capitalize text-gray-800">{ability.name}</h4>
            </div>
            <div className="max-w-md">
              {loading && ability.description === "Loading description..." ? (
                <LoadingSpinner message="Loading..." />
              ) : (
                <motion.span
                  className="text-gray-600 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {ability.description}
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
