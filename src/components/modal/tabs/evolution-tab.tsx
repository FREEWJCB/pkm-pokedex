"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRightIcon } from "../../icons"
import { getTypeColor } from "../../../utils/pokemon-types"
import { LoadingSpinner } from "../loading-spinner"
import type { ProcessedEvolution } from "../../../types/processed"

interface EvolutionTabProps {
  evolutions: ProcessedEvolution[]
  loading: boolean
}

export const EvolutionTab = ({ evolutions, loading }: EvolutionTabProps) => {
  if (loading) {
    return <LoadingSpinner message="Loading evolution data..." />
  }

  if (evolutions.length === 0) {
    return (
      <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="text-4xl sm:text-5xl md:text-6xl mb-4"
          animate={{ rotate: [0, 10] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          🔄
        </motion.div>
        <div className="text-gray-500 text-base sm:text-lg mb-2">No Evolution Data</div>
        <div className="text-gray-400 text-sm">This Pokémon doesn&apos;t evolve or evolution data is unavailable</div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="text-xl sm:text-2xl">🔄</span>
        <h3 className="text-base sm:text-lg font-bold text-gray-800">Evolution Chain</h3>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {evolutions.map((evolution, index) => (
          <motion.div
            key={`evolution-${evolution.from.id}-${evolution.to.id}-${index}`}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {/* RESPONSIVE EVOLUTION LAYOUT */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              {/* From Pokemon - Responsive */}
              <motion.div className="flex flex-col items-center flex-1" whileHover={{ scale: 1.05 }}>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 sm:mb-3">
                  <Image
                    src={evolution.from.sprite || "/placeholder.svg?height=96&width=96"}
                    alt={evolution.from.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="font-bold text-gray-800 capitalize mb-1 sm:mb-2 text-sm sm:text-base">
                  {evolution.from.name}
                </h4>
                <div className="flex gap-1">
                  {evolution.from.types.map((type) => (
                    <span
                      key={type.type.name}
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-white text-xs font-bold uppercase"
                      style={{ backgroundColor: getTypeColor(type.type.name) }}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Evolution Method - Responsive */}
              <motion.div
                className="flex flex-col items-center mx-2 sm:mx-4 md:mx-6 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                <motion.div
                  className="bg-white rounded-full p-2 sm:p-3 shadow-lg mb-2"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                    <ArrowRightIcon />
                  </div>
                </motion.div>

                <div className="text-center">
                  <div className="font-semibold text-blue-600 text-xs sm:text-sm mb-1">{evolution.method}</div>

                  {evolution.level && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold mb-1">
                      Level {evolution.level}
                    </div>
                  )}

                  {evolution.item && (
                    <div className="flex flex-col items-center">
                      {evolution.itemSprite && (
                        <div className="relative w-6 h-6 sm:w-8 sm:h-8 mb-1">
                          <Image
                            src={evolution.itemSprite || "/placeholder.svg"}
                            alt={evolution.item}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold capitalize">
                        {evolution.item}
                      </div>
                    </div>
                  )}

                  {evolution.condition && (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs mt-1 max-w-[100px] sm:max-w-none">
                      {evolution.condition}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* To Pokemon - Responsive */}
              <motion.div className="flex flex-col items-center flex-1" whileHover={{ scale: 1.05 }}>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-2 sm:mb-3">
                  <Image
                    src={evolution.to.sprite || "/placeholder.svg?height=96&width=96"}
                    alt={evolution.to.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="font-bold text-gray-800 capitalize mb-1 sm:mb-2 text-sm sm:text-base">
                  {evolution.to.name}
                </h4>
                <div className="flex gap-1">
                  {evolution.to.types.map((type) => (
                    <span
                      key={type.type.name}
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-white text-xs font-bold uppercase"
                      style={{ backgroundColor: getTypeColor(type.type.name) }}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Evolution Tips - Responsive */}
      <motion.div
        className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base sm:text-lg">💡</span>
          <h4 className="font-semibold text-blue-800 text-sm sm:text-base">Evolution Tips</h4>
        </div>
        <ul className="text-blue-700 text-xs sm:text-sm space-y-1">
          <li>• Evolution methods may vary between different Pokémon games</li>
          <li>• Some evolutions require specific conditions like time of day or location</li>
          <li>• Trading evolutions may need special items or conditions</li>
          <li>• Check your game&apos;s specific requirements for evolution</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
