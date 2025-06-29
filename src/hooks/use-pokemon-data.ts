"use client"

import { useState, useEffect, useMemo } from "react"
import type { Pokemon } from "../types/pokemon"
import type { PokemonSpecies } from "../types/api/species"
import type { EvolutionChain, ChainLink, EvolutionDetail } from "../types/api/evolution"
import type { Ability } from "../types/api/ability"
import type { Move } from "../types/api/move"
import type { Item } from "../types/api/item"
import type { PokemonAPI } from "../types/api/pokemon"
import type {
  ProcessedMove,
  ProcessedEvolution,
  ProcessedGameInfo,
  ProcessedTypeEffectiveness,
  ProcessedEvolutionPokemon,
  ProcessedEvolutionItem,
} from "../types/processed"
import { calculateTypeEffectiveness } from "../utils/type-effectiveness"
import {NamedAPIResource} from '/src/types/api/pokemon';

// Get environment variables with fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_POKEMON_API_BASE_URL || "https://pokeapi.co/api/v2"
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_POKEMON_API_TIMEOUT) || 10000
const RETRY_ATTEMPTS = Number(process.env.NEXT_PUBLIC_POKEMON_API_RETRY_ATTEMPTS) || 3
const DEBUG_API_CALLS = process.env.NEXT_PUBLIC_DEBUG_API_CALLS === "true"
const ENABLE_API_LOGGING = process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === "true"

// Enhanced fetch with timeout and retry
const enhancedFetch = async (url: string): Promise<Response> => {
  if (ENABLE_API_LOGGING) {
    console.log(`🌐 API Call: ${url}`)
  }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

      const response = await fetch(url, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        if (DEBUG_API_CALLS) {
          console.log(`✅ API Success (attempt ${attempt}): ${url}`)
        }
        return response
      }

      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error) {
      lastError = error as Error

      if (DEBUG_API_CALLS) {
        console.log(`❌ API Error (attempt ${attempt}/${RETRY_ATTEMPTS}): ${url}`, error)
      }

      if (attempt < RETRY_ATTEMPTS) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error(`Failed to fetch after ${RETRY_ATTEMPTS} attempts`)
}

export const usePokemonData = (pokemon: Pokemon | null) => {
  const [abilityDescriptions, setAbilityDescriptions] = useState<Record<string, string>>({})
  const [loadingAbilities, setLoadingAbilities] = useState(false)
  const [moves, setMoves] = useState<ProcessedMove[]>([])
  const [loadingMoves, setLoadingMoves] = useState(false)
  const [evolutionData, setEvolutionData] = useState<ProcessedEvolution[]>([])
  const [loadingEvolution, setLoadingEvolution] = useState(false)
  const [gameInfo, setGameInfo] = useState<ProcessedGameInfo[]>([])
  const [loadingGameInfo, setLoadingGameInfo] = useState(false)

  // Helper function to fetch Pokemon data with proper typing
  const fetchPokemonData = async (name: string): Promise<ProcessedEvolutionPokemon | null> => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/pokemon/${name}`)
      const data: PokemonAPI = await response.json()
      return {
        id: data.id,
        name: data.name,
        sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
        types: data.types,
      }
    } catch (error) {
      console.error(`Error fetching Pokemon data for ${name}:`, error)
      return null
    }
  }

  // Helper function to fetch Item data with proper typing
  const fetchItemData = async (url: string): Promise<ProcessedEvolutionItem | null> => {
    try {
      const response = await enhancedFetch(url)
      const data: Item = await response.json()
      return {
        name: data.name,
        sprite: data.sprites?.default || "",
      }
    } catch (error) {
      console.error(`Error fetching Item data from ${url}:`, error)
      return null
    }
  }

  // Helper function to fetch Move data with proper typing
  const fetchMoveData = async (url: string, learnMethod: string, level?: number): Promise<ProcessedMove | null> => {
    try {
      const response = await enhancedFetch(url)
      const data: Move = await response.json()

      // Get English description
      const englishEntry = data.effect_entries?.find((entry) => entry.language.name === "en")
      const flavorText = data.flavor_text_entries?.find((entry) => entry.language.name === "en")

      return {
        name: data.name.replace("-", " "),
        type: data.type.name,
        category: data.damage_class?.name || "status",
        power: data.power,
        accuracy: data.accuracy,
        pp: data.pp,
        description: englishEntry?.short_effect || flavorText?.flavor_text || "No description available",
        learnMethod,
        level,
      }
    } catch (error) {
      console.error(`Error fetching move data from ${url}:`, error)
      return null
    }
  }

  // Process evolution chain with proper typing
  const processEvolutionChain = (
    chain: ChainLink,
    pokemonDataMap: Record<string, ProcessedEvolutionPokemon>,
    itemDataMap: Record<string, ProcessedEvolutionItem>,
  ): ProcessedEvolution[] => {
    const evolutions: ProcessedEvolution[] = []

    chain.evolves_to.forEach((evolution) => {
      const fromPokemon = pokemonDataMap[chain.species.name]
      const toPokemon = pokemonDataMap[evolution.species.name]

      if (!fromPokemon || !toPokemon) return

      const details: EvolutionDetail | undefined = evolution.evolution_details[0] // Take first evolution method
      let method = "Unknown"
      let level: number | undefined
      let item: string | undefined
      let itemSprite: string | undefined
      let condition: string | undefined

      if (details) {
        if (details.min_level) {
          method = "Level Up"
          level = details.min_level
        } else if (details.item) {
          method = "Use Item"
          item = details.item.name.replace("-", " ")
          itemSprite = itemDataMap[details.item.name]?.sprite
        } else if (details.trigger.name === "trade") {
          method = "Trade"
          if (details.held_item) {
            condition = `While holding ${details.held_item.name.replace("-", " ")}`
            item = details.held_item.name.replace("-", " ")
            itemSprite = itemDataMap[details.held_item.name]?.sprite
          }
        } else if (details.trigger.name === "use-item") {
          method = "Use Item"
          item = (details.item as NamedAPIResource | null)?.name.replace("-", " ") || "Unknown Item"
          if (details.item) {
            itemSprite = itemDataMap[(details.item as NamedAPIResource).name]?.sprite
          }
        } else {
          method = details.trigger.name.replace("-", " ")
        }

        if (details.time_of_day) {
          condition = `${condition ? condition + ", " : ""}During ${details.time_of_day}`
        }
        if (details.min_happiness) {
          condition = `${condition ? condition + ", " : ""}Happiness ≥ ${details.min_happiness}`
        }
        if (details.location) {
          condition = `${condition ? condition + ", " : ""}At ${details.location.name.replace("-", " ")}`
        }
      }

      evolutions.push({
        from: fromPokemon,
        to: toPokemon,
        method,
        level,
        item,
        itemSprite,
        condition,
      })

      // Recursively process further evolutions
      evolutions.push(...processEvolutionChain(evolution, pokemonDataMap, itemDataMap))
    })

    return evolutions
  }

  // Collect Pokemon names from evolution chain
  const collectPokemonNames = (chain: ChainLink): string[] => {
    const names = [chain.species.name]
    chain.evolves_to.forEach((evolution) => {
      names.push(...collectPokemonNames(evolution))
    })
    return names
  }

  // Collect item URLs from evolution chain
  const collectItemUrls = (chain: ChainLink): string[] => {
    const urls: string[] = []
    chain.evolves_to.forEach((evolution) => {
      evolution.evolution_details.forEach((detail) => {
        if (detail.item?.url) {
          urls.push(detail.item.url)
        }
        if (detail.held_item?.url) {
          urls.push(detail.held_item.url)
        }
      })
      urls.push(...collectItemUrls(evolution))
    })
    return [...new Set(urls)] // Remove duplicates
  }

  // Calculate type effectiveness with proper typing
  const effectivenessData: ProcessedTypeEffectiveness[] = useMemo(() => {
    if (!pokemon) return []

    const types = pokemon.types.map((t) => t.type.name)
    const typeEffectiveness = calculateTypeEffectiveness(types)
    const data: ProcessedTypeEffectiveness[] = []
    const pokemonTypes = pokemon.types.map((t) => t.type.name)

    // Helper function for descriptions
    const getEffectivenessDescription = (
      category: ProcessedTypeEffectiveness["category"],
      attackingType: string,
    ): string => {
      const pokemonName = pokemon?.name || "this Pokémon"
      const typeNames = pokemonTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join("/")
      const attackingTypeName = attackingType.charAt(0).toUpperCase() + attackingType.slice(1)

      switch (category) {
        case "weak-to":
          return `${pokemonName} (${typeNames}) is vulnerable to ${attackingTypeName} attacks. ${attackingTypeName} moves deal double damage (2x) due to type disadvantage.`
        case "resistant-to":
          return `${pokemonName} (${typeNames}) resists ${attackingTypeName} attacks. ${attackingTypeName} moves deal reduced damage (0.5x) due to type resistance.`
        case "immune-to":
          return `${pokemonName} (${typeNames}) is completely immune to ${attackingTypeName} attacks. ${attackingTypeName} moves have no effect (0x damage).`
        case "strong-against":
          return `${pokemonName}'s ${typeNames} attacks are super effective against ${attackingTypeName} types. Deals double damage (2x) to ${attackingTypeName} opponents.`
        case "weak-against":
          return `${pokemonName}'s ${typeNames} attacks are not very effective against ${attackingTypeName} types. Deals reduced damage (0.5x) to ${attackingTypeName} opponents.`
        case "no-effect-against":
          return `${pokemonName}'s ${typeNames} attacks have no effect on ${attackingTypeName} types. Deals no damage (0x) to ${attackingTypeName} opponents.`
        default:
          return "Unknown effectiveness relationship."
      }
    }

    // Add defensive effectiveness
    typeEffectiveness.weakTo.forEach((type) => {
      data.push({
        type,
        category: "weak-to",
        multiplier: "2x",
        description: getEffectivenessDescription("weak-to", type),
      })
    })

    typeEffectiveness.resistantTo.forEach((type) => {
      data.push({
        type,
        category: "resistant-to",
        multiplier: "0.5x",
        description: getEffectivenessDescription("resistant-to", type),
      })
    })

    typeEffectiveness.immuneTo.forEach((type) => {
      data.push({
        type,
        category: "immune-to",
        multiplier: "0x",
        description: getEffectivenessDescription("immune-to", type),
      })
    })

    // Add offensive effectiveness
    typeEffectiveness.strongAgainst.forEach((type) => {
      data.push({
        type,
        category: "strong-against",
        multiplier: "2x",
        description: getEffectivenessDescription("strong-against", type),
      })
    })

    typeEffectiveness.weakAgainst.forEach((type) => {
      data.push({
        type,
        category: "weak-against",
        multiplier: "0.5x",
        description: getEffectivenessDescription("weak-against", type),
      })
    })

    typeEffectiveness.noEffectAgainst.forEach((type) => {
      data.push({
        type,
        category: "no-effect-against",
        multiplier: "0x",
        description: getEffectivenessDescription("no-effect-against", type),
      })
    })

    return data
  }, [pokemon])

  // Fetch abilities with proper typing
  useEffect(() => {
    if (!pokemon) return

    const fetchAbilities = async () => {
      setLoadingAbilities(true)
      const descriptions: Record<string, string> = {}

      try {
        await Promise.all(
          pokemon.abilities.map(async (ability) => {
            try {
              const response = await enhancedFetch(ability.ability.url)
              const data: Ability = await response.json()
              const englishEntry = data.effect_entries?.find((entry) => entry.language.name === "en")
              descriptions[ability.ability.name] = englishEntry?.effect || "No description available"
            } catch (error) {
              console.error(`Error fetching ability ${ability.ability.name}:`, error)
              descriptions[ability.ability.name] = "Description unavailable"
            }
          }),
        )
        setAbilityDescriptions(descriptions)
      } catch (error) {
        console.error("Error fetching abilities:", error)
      } finally {
        setLoadingAbilities(false)
      }
    }

    fetchAbilities()
  }, [pokemon])

  // Fetch moves with proper typing
  useEffect(() => {
    if (!pokemon) return

    const fetchMoves = async () => {
      setLoadingMoves(true)
      try {
        const movePromises = pokemon.moves.slice(0, 20).map(async (moveInfo) => {
          const versionDetails = moveInfo.version_group_details[0]
          const learnMethod = versionDetails.move_learn_method.name
          const level = versionDetails.level_learned_at || undefined

          return await fetchMoveData(moveInfo.move.url, learnMethod, level)
        })

        const moveResults = await Promise.all(movePromises)
        const validMoves = moveResults.filter((move): move is ProcessedMove => move !== null)

        // Sort moves by learn method and level
        validMoves.sort((a, b) => {
          if (a.learnMethod !== b.learnMethod) {
            const methodOrder = { "level-up": 0, machine: 1, tutor: 2, egg: 3, other: 4 }
            return (
              (methodOrder[a.learnMethod as keyof typeof methodOrder] || 4) -
              (methodOrder[b.learnMethod as keyof typeof methodOrder] || 4)
            )
          }
          if (a.level && b.level) {
            return a.level - b.level
          }
          return a.name.localeCompare(b.name)
        })

        setMoves(validMoves)
      } catch (error) {
        console.error("Error fetching moves:", error)
      } finally {
        setLoadingMoves(false)
      }
    }

    fetchMoves()
  }, [pokemon])

  // Fetch species data, evolution chain, and game info with proper typing
  useEffect(() => {
    if (!pokemon) return

    const fetchSpeciesData = async () => {
      setLoadingEvolution(true)
      setLoadingGameInfo(true)

      try {
        // Fetch species data
        const speciesResponse = await enhancedFetch(`${API_BASE_URL}/pokemon-species/${pokemon.name}`)
        const speciesData: PokemonSpecies = await speciesResponse.json()

        // Process game info (flavor text entries)
        const gameInfoData: ProcessedGameInfo[] = []
        if (speciesData.flavor_text_entries) {
          // Get unique English entries
          const englishEntries = speciesData.flavor_text_entries.filter((entry) => entry.language.name === "en")

          // Group by version and take the first entry for each
          const versionMap = new Map<string, ProcessedGameInfo>()
          englishEntries.forEach((entry) => {
            const versionName = entry.version.name
            if (!versionMap.has(versionName)) {
              versionMap.set(versionName, {
                game: versionName.charAt(0).toUpperCase() + versionName.slice(1),
                version: entry.version.name,
                description: entry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ").trim(),
              })
            }
          })

          gameInfoData.push(...Array.from(versionMap.values()))
        }

        setGameInfo(gameInfoData)
        setLoadingGameInfo(false)

        // Fetch evolution chain
        if (speciesData.evolution_chain?.url) {
          try {
            const evolutionResponse = await enhancedFetch(speciesData.evolution_chain.url)
            const evolutionData: EvolutionChain = await evolutionResponse.json()

            const allPokemonNames = collectPokemonNames(evolutionData.chain)
            const allItemUrls = collectItemUrls(evolutionData.chain)

            // Fetch data for all Pokemon in the evolution chain
            const pokemonDataPromises = allPokemonNames.map(async (name) => {
              const pokemonData = await fetchPokemonData(name)
              return { name, data: pokemonData }
            })

            const pokemonDataResults = await Promise.all(pokemonDataPromises)
            const pokemonDataMap: Record<string, ProcessedEvolutionPokemon> = {}

            pokemonDataResults.forEach(({ name, data }) => {
              if (data) {
                pokemonDataMap[name] = data
              }
            })

            // Fetch data for all items in the evolution chain
            const itemDataPromises = allItemUrls.map(async (url) => {
              const itemData = await fetchItemData(url)
              return { url, data: itemData }
            })

            const itemDataResults = await Promise.all(itemDataPromises)
            const itemDataMap: Record<string, ProcessedEvolutionItem> = {}

            itemDataResults.forEach(({ data }) => {
              if (data) {
                itemDataMap[data.name] = data
              }
            })

            // Process evolution chain
            const processedEvolutions = processEvolutionChain(evolutionData.chain, pokemonDataMap, itemDataMap)
            setEvolutionData(processedEvolutions)
          } catch (error) {
            console.error("Error fetching evolution chain:", error)
          }
        }
        setLoadingEvolution(false)
      } catch (error) {
        console.error("Error fetching species data:", error)
        setLoadingEvolution(false)
        setLoadingGameInfo(false)
      }
    }

    fetchSpeciesData()
  }, [pokemon])

  return {
    abilityDescriptions,
    loadingAbilities,
    moves,
    loadingMoves,
    evolutionData,
    loadingEvolution,
    gameInfo,
    loadingGameInfo,
    effectivenessData,
  }
}
