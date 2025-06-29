"use client"

import { motion } from "framer-motion"
import { ShieldIcon, SwordIcon } from "../../icons"
import { getTypeColor } from "../../../utils/pokemon-types"
import type { ProcessedTypeEffectiveness } from "../../../types/processed"

interface TypeEffectivenessTabProps {
  effectiveness: ProcessedTypeEffectiveness[]
}

export const TypeEffectivenessTab = ({ effectiveness }: TypeEffectivenessTabProps) => {
  // Group effectiveness by category
  const groupedEffectiveness = effectiveness.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, ProcessedTypeEffectiveness[]>,
  )

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "weak-to":
        return {
          title: "Weak To (Takes 2x Damage)",
          icon: "🛡️",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          description: "These types deal double damage to this Pokémon",
        }
      case "resistant-to":
        return {
          title: "Resistant To (Takes 0.5x Damage)",
          icon: "🛡️",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          description: "These types deal reduced damage to this Pokémon",
        }
      case "immune-to":
        return {
          title: "Immune To (Takes 0x Damage)",
          icon: "🚫",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-800",
          description: "These types have no effect on this Pokémon",
        }
      case "strong-against":
        return {
          title: "Strong Against (Deals 2x Damage)",
          icon: "⚔️",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          description: "This Pokémon's attacks are super effective against these types",
        }
      case "weak-against":
        return {
          title: "Weak Against (Deals 0.5x Damage)",
          icon: "⚔️",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          description: "This Pokémon's attacks are not very effective against these types",
        }
      case "no-effect-against":
        return {
          title: "No Effect Against (Deals 0x Damage)",
          icon: "🚫",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-800",
          description: "This Pokémon's attacks have no effect on these types",
        }
      default:
        return {
          title: "Unknown",
          icon: "❓",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-800",
          description: "",
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🛡️</span>
        <h3 className="text-lg font-bold text-gray-800">Type Effectiveness Chart</h3>
      </div>

      {/* Defensive Effectiveness */}
      <div className="mb-8">
        <motion.h4
          className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ShieldIcon />
          Defensive Type Chart
        </motion.h4>

        <div className="grid gap-4">
          {["weak-to", "resistant-to", "immune-to"].map((category, categoryIndex) => {
            const types = groupedEffectiveness[category]
            if (!types || types.length === 0) return null

            const categoryInfo = getCategoryInfo(category)

            return (
              <motion.div
                key={category}
                className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} border rounded-lg p-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <h5 className={`font-semibold ${categoryInfo.textColor}`}>{categoryInfo.title}</h5>
                  <span className={`text-sm ${categoryInfo.textColor} opacity-75`}>({types.length} types)</span>
                </div>

                <p className={`text-sm ${categoryInfo.textColor} opacity-80 mb-3`}>{categoryInfo.description}</p>

                <div className="flex flex-wrap gap-2">
                  {types.map((type, index) => (
                    <motion.div
                      key={`${category}-${type.type}-${index}`}
                      className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + categoryIndex * 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span
                        className="px-2 py-1 rounded text-white text-xs font-bold uppercase"
                        style={{ backgroundColor: getTypeColor(type.type) }}
                      >
                        {type.type}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{type.multiplier}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Offensive Effectiveness */}
      <div>
        <motion.h4
          className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SwordIcon />
          Offensive Type Chart
        </motion.h4>

        <div className="grid gap-4">
          {["strong-against", "weak-against", "no-effect-against"].map((category, categoryIndex) => {
            const types = groupedEffectiveness[category]
            if (!types || types.length === 0) return null

            const categoryInfo = getCategoryInfo(category)

            return (
              <motion.div
                key={category}
                className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} border rounded-lg p-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <h5 className={`font-semibold ${categoryInfo.textColor}`}>{categoryInfo.title}</h5>
                  <span className={`text-sm ${categoryInfo.textColor} opacity-75`}>({types.length} types)</span>
                </div>

                <p className={`text-sm ${categoryInfo.textColor} opacity-80 mb-3`}>{categoryInfo.description}</p>

                <div className="flex flex-wrap gap-2">
                  {types.map((type, index) => (
                    <motion.div
                      key={`${category}-${type.type}-${index}`}
                      className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + categoryIndex * 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span
                        className="px-2 py-1 rounded text-white text-xs font-bold uppercase"
                        style={{ backgroundColor: getTypeColor(type.type) }}
                      >
                        {type.type}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{type.multiplier}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Type Chart Legend */}
      <motion.div
        className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📖</span>
          <h4 className="font-semibold text-gray-800">Type Effectiveness Legend</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <strong>2x:</strong> Super effective (double damage)
          </div>
          <div>
            <strong>0.5x:</strong> Not very effective (half damage)
          </div>
          <div>
            <strong>0x:</strong> No effect (no damage)
          </div>
          <div>
            <strong>1x:</strong> Normal effectiveness (not shown)
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
