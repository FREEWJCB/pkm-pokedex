"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  message?: string
  showProgress?: boolean
  current?: number
  total?: number
}

export const LoadingSpinner = ({
  message = "Loading Pokémon...",
  showProgress = false,
  current = 0,
  total = 0,
}: LoadingSpinnerProps) => {
  const percentage = total > 0 ? (current / total) * 100 : 0

  // Determine loading phase based on progress
  const getLoadingPhase = () => {
    if (total === 0) return "Initializing..."
    if (current === 0) return "Fetching Pokemon list..."
    if (current < total) return "Loading Pokemon details..."
    return "Finalizing..."
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative text-center max-w-md w-full px-4">
        {/* Animated Pokeball Spinner */}
        <motion.div
          className="relative w-20 h-20 mx-auto mb-6 pokeball-spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Pokeball design */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden shadow-lg">
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-gray-100 to-white"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-gray-800">
              <motion.div
                className="w-2 h-2 bg-gray-800 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
              />
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>
          </div>
        </motion.div>

        {/* Loading message with typewriter effect */}
        <motion.div
          className="text-white font-medium text-lg mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.div>

        {/* Loading phase indicator */}
        <motion.div
          className="text-blue-300 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {getLoadingPhase()}
        </motion.div>

        {/* Progress section - Always show when showProgress is true */}
        {showProgress && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Animated progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                className="h-4 rounded-full relative overflow-hidden"
                style={{
                  background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    repeatType: "reverse",
                  }}
                />
              </motion.div>
            </div>

            {/* Stats with animated counters */}
            <div className="flex justify-between text-sm text-gray-300">
              <motion.span
                key={`current-${current}`}
                initial={{ scale: 1.2, color: "#22c55e" }}
                animate={{ scale: 1, color: "#d1d5db" }}
                transition={{ duration: 0.3 }}
              >
                {current} / {total} Pokémon loaded
              </motion.span>
              <motion.span
                key={`percentage-${percentage.toFixed(1)}`}
                initial={{ scale: 1.2, color: "#22c55e" }}
                animate={{ scale: 1, color: "#d1d5db" }}
                transition={{ duration: 0.3 }}
                data-testid="percentage-display"
              >
                {percentage.toFixed(1)}%
              </motion.span>
            </div>

            {/* API info with pulse animation */}
            <motion.div
              className="text-xs text-gray-400"
              animate={{
                opacity: [0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            >
              📋 Using PokeAPI list endpoint for efficient loading
            </motion.div>
          </motion.div>
        )}

        {/* Loading tips with stagger animation - Only show when total > 0 */}
        {showProgress && total > 0 && (
          <motion.div
            className="mt-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="text-blue-200 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.span
                className="inline-block mr-2"
                animate={{
                  scale: [1, 1.2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
              >
                💡
              </motion.span>
              <strong>Process:</strong> First fetching Pokemon list, then loading individual details in batches!
            </motion.div>
          </motion.div>
        )}

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-20, -40],
                opacity: [0.3, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
