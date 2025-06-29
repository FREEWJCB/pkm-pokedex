"use client"

import { motion } from "framer-motion"
import { getRegionById } from "../utils/pokemon-regions"

interface RegionInfoProps {
  regionId: string
  pokemonCount: number
}

export const RegionInfo = ({ regionId, pokemonCount }: RegionInfoProps) => {
  const region = getRegionById(regionId)

  if (!region) return null

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-black rounded-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-blue-500 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* RESPONSIVE LAYOUT */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
        {/* Main Info Section */}
        <div className="flex-1">
          <motion.h2
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {region.name} Region
          </motion.h2>

          <motion.p
            className="text-black text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 opacity-90 leading-relaxed"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {region.description}
          </motion.p>

          {/* Stats Badges - Responsive Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="bg-white bg-opacity-20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-white border-opacity-30 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl">🏆</span>
                <span
                  className="font-semibold text-xs sm:text-sm lg:text-base"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Generation {region.generation}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white bg-opacity-20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-white border-opacity-30 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl">📱</span>
                <span
                  className="font-semibold text-xs sm:text-sm lg:text-base"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  #{region.startId} - #{region.endId}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white bg-opacity-20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-white border-opacity-30 text-center sm:col-span-2 lg:col-span-1"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl">🔍</span>
                <span
                  className="font-semibold text-xs sm:text-sm lg:text-base"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {pokemonCount} Pokémon found
                </span>
              </div>
            </motion.div>

            {/* Additional info badge for larger screens */}
            <motion.div
              className="hidden xl:block bg-white bg-opacity-20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-white border-opacity-30 text-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl">⭐</span>
                <span
                  className="font-semibold text-xs sm:text-sm lg:text-base"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {region.endId - region.startId + 1} Total
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Region Image/Icon - Only on larger screens */}
        <motion.div
          className="hidden lg:block flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30"
            whileHover={{
              scale: 1.1,
              rotate: 360,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-2xl lg:text-3xl xl:text-4xl">🗺️</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress indicator for mobile */}
      <motion.div
        className="mt-4 sm:hidden"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <motion.div
            className="bg-white h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((pokemonCount / (region.endId - region.startId + 1)) * 100, 100)}%` }}
            transition={{ delay: 0.8, duration: 1 }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-white opacity-75">
            Loading Progress: {pokemonCount}/{region.endId - region.startId + 1}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
