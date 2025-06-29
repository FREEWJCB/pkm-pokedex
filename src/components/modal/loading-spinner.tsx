"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  message: string
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <motion.div className="flex items-center justify-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <motion.div
          className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <span className="text-gray-500">{message}</span>
      </div>
    </motion.div>
  )
}
