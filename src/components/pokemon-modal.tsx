"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Pokemon } from "../types/pokemon"
import type { ProcessedAbility } from "../types/processed"
import { ModalHeader } from "./modal/modal-header"
import { ModalTabs } from "./modal/modal-tabs"
import { StatsTab } from "./modal/tabs/stats-tab"
import { AbilitiesTab } from "./modal/tabs/abilities-tab"
import { MovesTab } from "./modal/tabs/moves-tab"
import { EvolutionTab } from "./modal/tabs/evolution-tab"
import { TypeEffectivenessTab } from "./modal/tabs/type-effectiveness-tab"
import { GameInfoTab } from "./modal/tabs/game-info-tab"
import { usePokemonData } from "../hooks/use-pokemon-data"

interface PokemonModalProps {
  pokemon: Pokemon | null
  isOpen: boolean
  onClose: () => void
}

export const PokemonModal = ({ pokemon, isOpen, onClose }: PokemonModalProps) => {
  const [activeTab, setActiveTab] = useState<
    "stats" | "abilities" | "moves" | "evolution" | "effectiveness" | "gameinfo"
  >("stats")

  // Custom hook para manejar todos los datos del Pokemon
  const {
    abilityDescriptions,
    loadingAbilities,
    moves,
    loadingMoves,
    evolutionData,
    loadingEvolution,
    gameInfo,
    loadingGameInfo,
    effectivenessData,
  } = usePokemonData(pokemon)

  // Prepare abilities data with proper typing
  const abilitiesData: ProcessedAbility[] = useMemo(
    () =>
      pokemon
        ? pokemon.abilities.map((ability) => ({
            name: ability.ability.name.replace("-", " "),
            description: abilityDescriptions[ability.ability.name] || "Loading description...",
          }))
        : [],
    [pokemon, abilityDescriptions],
  )

  // Calculate total stats for legendary detection
  const totalStats = useMemo(
    () => (pokemon ? pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0) : 0),
    [pokemon],
  )
  const isLegendary = totalStats > 600

  const tabs = useMemo(
    () => [
      { id: "stats", label: "Base Stats", count: pokemon ? pokemon.stats.length : 0, icon: "📊" },
      { id: "abilities", label: "Abilities", count: abilitiesData.length, icon: "⚡" },
      { id: "moves", label: "Moves", count: moves.length, icon: "⚔️" },
      { id: "evolution", label: "Evolution", count: evolutionData.length, icon: "🔄" },
      { id: "effectiveness", label: "Type Chart", count: effectivenessData.length, icon: "🛡️" },
      { id: "gameinfo", label: "Game Info", count: gameInfo.length, icon: "🎮" },
    ],
    [pokemon, abilitiesData.length, moves.length, evolutionData.length, effectivenessData.length, gameInfo.length],
  )

  const renderTabContent = () => {
    if (!pokemon) return null

    switch (activeTab) {
      case "stats":
        return <StatsTab pokemon={pokemon} isLegendary={isLegendary} />
      case "abilities":
        return <AbilitiesTab abilities={abilitiesData} loading={loadingAbilities} />
      case "moves":
        return <MovesTab moves={moves} loading={loadingMoves} />
      case "evolution":
        return <EvolutionTab evolutions={evolutionData} loading={loadingEvolution} />
      case "effectiveness":
        return <TypeEffectivenessTab effectiveness={effectivenessData} />
      case "gameinfo":
        return <GameInfoTab gameInfo={gameInfo} loading={loadingGameInfo} />
      default:
        return (
          <div className="text-center py-8">
            <span className="text-gray-500">Tab content coming soon...</span>
          </div>
        )
    }
  }

  // Early return after all hooks have been called
  if (!isOpen || !pokemon) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* FIXED RESPONSIVE MODAL CONTAINER */}
          <motion.div
            className="bg-white rounded-xl w-full h-full sm:w-[95vw] sm:h-[95vh] md:w-[90vw] md:h-[90vh] lg:w-[85vw] lg:h-[85vh] xl:w-[80vw] xl:h-[80vh] 2xl:max-w-7xl 2xl:max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER - Fixed height */}
            <div className="flex-shrink-0">
              <ModalHeader pokemon={pokemon} onClose={onClose} isLegendary={isLegendary} />
            </div>

            {/* TABS - Fixed height */}
            <div className="flex-shrink-0">
              <ModalTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(tabId) =>
                  setActiveTab(
                    tabId as "stats" | "abilities" | "moves" | "evolution" | "effectiveness" | "gameinfo"
                  )
                }
              />
            </div>

            {/* CONTENT - Flexible with scroll */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
              <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
