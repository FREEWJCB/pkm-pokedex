"use client"

import { motion } from "framer-motion"

interface Tab {
  id: string
  label: string
  count: number
  icon: string
}

interface ModalTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const ModalTabs = ({ tabs, activeTab, onTabChange }: ModalTabsProps) => {
  return (
    <motion.div
      className="border-b border-gray-200 bg-gray-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* FIXED RESPONSIVE TAB CONTAINER */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 font-medium text-xs sm:text-sm md:text-base border-b-2 transition-all duration-300 whitespace-nowrap relative cursor-pointer hover:bg-gray-100 min-w-fit flex-shrink-0 ${
              activeTab === tab.id
                ? "border-current text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: "pointer" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm sm:text-base md:text-lg">{tab.icon}</span>

              {/* Responsive label display */}
              <span className="font-semibold hidden sm:inline md:text-base lg:text-lg">{tab.label}</span>
              <span className="font-semibold sm:hidden text-xs">{tab.label.split(" ")[0]}</span>

              <motion.span
                className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold min-w-[16px] sm:min-w-[20px] md:min-w-[24px] text-center ${
                  activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
                }`}
                layout
              >
                {tab.count}
              </motion.span>
            </div>

            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
