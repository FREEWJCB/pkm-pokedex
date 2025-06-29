import { unstable_cache } from "next/cache"
import type { Pokemon } from "../types/pokemon"
import type { PokemonAPI } from "../types/api/pokemon"
import type { PokemonSpecies } from "../types/api/species"
import type { EvolutionChain } from "../types/api/evolution"
import type { Ability } from "../types/api/ability"
import type { Move } from "../types/api/move"
import type { Item } from "../types/api/item"
import type { PokemonListResponse, PokemonListItem } from "../types/api/pokemon-list"

// Get environment variables with fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_POKEMON_API_BASE_URL || "https://pokeapi.co/api/v2"
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_POKEMON_API_TIMEOUT) || 10000
const RETRY_ATTEMPTS = Number(process.env.NEXT_PUBLIC_POKEMON_API_RETRY_ATTEMPTS) || 3
const BATCH_SIZE = Number(process.env.NEXT_PUBLIC_POKEMON_API_BATCH_SIZE) || 10
const DELAY_MS = Number(process.env.NEXT_PUBLIC_POKEMON_API_DELAY_MS) || 150
const CACHE_TTL_MINUTES = Number(process.env.NEXT_PUBLIC_CACHE_TTL_MINUTES) || 60
const MEMORY_CACHE_TTL_MINUTES = Number(process.env.NEXT_PUBLIC_MEMORY_CACHE_TTL_MINUTES) || 30
const DEBUG_API_CALLS = process.env.NEXT_PUBLIC_DEBUG_API_CALLS === "true"
const ENABLE_API_LOGGING = process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === "true"

// Cache duration in seconds
const CACHE_DURATION = CACHE_TTL_MINUTES * 60

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

// Basic Pokemon data cache (SERVER ONLY)
export const getCachedPokemon = unstable_cache(
  async (id: number): Promise<Pokemon | null> => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/pokemon/${id}`)
      const data: PokemonAPI = await response.json()

      // Convert PokemonAPI to our Pokemon interface
      const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        sprites: data.sprites,
        types: data.types,
        height: data.height,
        weight: data.weight,
        stats: data.stats,
        abilities: data.abilities,
        moves: data.moves,
        base_experience: data.base_experience,
      }

      return pokemon
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error)
      return null
    }
  },
  ["pokemon"],
  {
    revalidate: CACHE_DURATION,
    tags: ["pokemon"],
  },
)

// Pokemon List cache (SERVER ONLY)
export const getCachedPokemonList = unstable_cache(
  async (limit: number, offset: number): Promise<PokemonListResponse | null> => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
      const data: PokemonListResponse = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching Pokemon list (limit: ${limit}, offset: ${offset}):`, error)
      return null
    }
  },
  ["pokemon-list"],
  {
    revalidate: CACHE_DURATION,
    tags: ["pokemon-list"],
  },
)

// Species data cache (SERVER ONLY)
export const getCachedSpecies = unstable_cache(
  async (name: string): Promise<PokemonSpecies | null> => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/pokemon-species/${name}`)
      const data: PokemonSpecies = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching species ${name}:`, error)
      return null
    }
  },
  ["pokemon-species"],
  {
    revalidate: CACHE_DURATION,
    tags: ["pokemon-species"],
  },
)

// Evolution chain cache (SERVER ONLY)
export const getCachedEvolutionChain = unstable_cache(
  async (url: string): Promise<EvolutionChain | null> => {
    try {
      const response = await enhancedFetch(url)
      const data: EvolutionChain = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching evolution chain from ${url}:`, error)
      return null
    }
  },
  ["evolution-chain"],
  {
    revalidate: CACHE_DURATION,
    tags: ["evolution-chain"],
  },
)

// Ability data cache (SERVER ONLY)
export const getCachedAbility = unstable_cache(
  async (url: string): Promise<Ability | null> => {
    try {
      const response = await enhancedFetch(url)
      const data: Ability = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching ability from ${url}:`, error)
      return null
    }
  },
  ["ability"],
  {
    revalidate: CACHE_DURATION,
    tags: ["ability"],
  },
)

// Move data cache (SERVER ONLY)
export const getCachedMove = unstable_cache(
  async (url: string): Promise<Move | null> => {
    try {
      const response = await enhancedFetch(url)
      const data: Move = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching move from ${url}:`, error)
      return null
    }
  },
  ["move"],
  {
    revalidate: CACHE_DURATION,
    tags: ["move"],
  },
)

// Item data cache (SERVER ONLY)
export const getCachedItem = unstable_cache(
  async (url: string): Promise<Item | null> => {
    try {
      const response = await enhancedFetch(url)
      const data: Item = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching item from ${url}:`, error)
      return null
    }
  },
  ["item"],
  {
    revalidate: CACHE_DURATION,
    tags: ["item"],
  },
)

// Cache invalidation helpers
export const invalidatePokemonCache = () => {
  // This would be used if you need to manually invalidate cache
  // revalidateTag('pokemon')
}

// Memory cache for client-side caching
class MemoryCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>()
  private ttl: number

  constructor(ttlMinutes = MEMORY_CACHE_TTL_MINUTES) {
    this.ttl = ttlMinutes * 60 * 1000 // Convert to milliseconds
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
    if (DEBUG_API_CALLS) {
      console.log(`💾 Cache SET: ${key}`)
    }
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      if (DEBUG_API_CALLS) {
        console.log(`💾 Cache MISS: ${key}`)
      }
      return null
    }

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      if (DEBUG_API_CALLS) {
        console.log(`💾 Cache EXPIRED: ${key}`)
      }
      return null
    }

    if (DEBUG_API_CALLS) {
      console.log(`💾 Cache HIT: ${key}`)
    }
    return item.data
  }

  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    if (DEBUG_API_CALLS) {
      console.log(`💾 Cache CLEARED: ${size} items removed`)
    }
  }

  size(): number {
    return this.cache.size
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

// Export memory cache instances for CLIENT-SIDE use
export const pokemonMemoryCache = new MemoryCache<Pokemon>()
export const pokemonListMemoryCache = new MemoryCache<PokemonListResponse>()
export const speciesMemoryCache = new MemoryCache<PokemonSpecies>()
export const abilityMemoryCache = new MemoryCache<Ability>()
export const moveMemoryCache = new MemoryCache<Move>()
export const itemMemoryCache = new MemoryCache<Item>()
export const evolutionMemoryCache = new MemoryCache<EvolutionChain>()

// CLIENT-SIDE Pokemon List fetcher with memory cache
export const fetchPokemonListWithCache = async (limit: number, offset: number): Promise<PokemonListResponse | null> => {
  const cacheKey = `pokemon-list-${limit}-${offset}`

  // Check memory cache first
  const cached = pokemonListMemoryCache.get(cacheKey)
  if (cached) {
    console.log(`📋 Using cached Pokemon list (${limit} items, offset ${offset})`)
    return cached
  }

  try {
    console.log(`📋 Fetching Pokemon list from API: limit=${limit}, offset=${offset}`)
    const response = await enhancedFetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
    const data: PokemonListResponse = await response.json()
    console.log(`📋 Received ${data.results.length} Pokemon in list`)

    // Cache the result
    pokemonListMemoryCache.set(cacheKey, data)
    return data
  } catch (error) {
    console.error(`Error fetching Pokemon list (limit: ${limit}, offset: ${offset}):`, error)
    return null
  }
}

// CLIENT-SIDE Pokemon fetcher with memory cache
export const fetchPokemonWithCache = async (id: number): Promise<Pokemon | null> => {
  const cacheKey = `pokemon-${id}`

  // Check memory cache first
  const cached = pokemonMemoryCache.get(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const response = await enhancedFetch(`${API_BASE_URL}/pokemon/${id}`)
    const data: PokemonAPI = await response.json()

    // Convert PokemonAPI to our Pokemon interface
    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      sprites: data.sprites,
      types: data.types,
      height: data.height,
      weight: data.weight,
      stats: data.stats,
      abilities: data.abilities,
      moves: data.moves,
      base_experience: data.base_experience,
    }

    // Cache the result
    pokemonMemoryCache.set(cacheKey, pokemon)
    return pokemon
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error)
    return null
  }
}

// Extract Pokemon ID from PokeAPI URL
const extractPokemonIdFromUrl = (url: string): number => {
  const urlParts = url.split("/")
  const id = urlParts[urlParts.length - 2]
  return Number.parseInt(id, 10)
}

// CLIENT-SIDE region Pokemon fetcher using list API FIRST
export const fetchRegionPokemon = async (
  startId: number,
  endId: number,
  onProgress?: (current: number, total: number) => void,
): Promise<Pokemon[]> => {
  const regionCacheKey = `region-${startId}-${endId}`
  const totalPokemon = endId - startId + 1
  const allPokemon: Pokemon[] = []

  try {
    // 🟢 PASO 1: INTENTAR USAR LA API DE LISTA
    console.log(`🚀 Starting region fetch: ${startId}-${endId} (${totalPokemon} Pokemon)`)
    console.log(`📋 Calling list API: ${API_BASE_URL}/pokemon?limit=${totalPokemon}&offset=${startId - 1}`)

    const listData = await fetchPokemonListWithCache(totalPokemon, startId - 1)

    if (!listData || !listData.results) {
      // ❌ SI FALLA LA LISTA, LANZA ERROR PARA IR AL CATCH
      throw new Error("Failed to fetch Pokemon list")
    }

    const pokemonList = listData.results
    console.log(`📋 Successfully fetched list with ${pokemonList.length} Pokemon`)

    // Report initial progress
    if (onProgress) {
      onProgress(0, pokemonList.length)
    }

    // 🟢 PASO 2: CARGAR DETALLES USANDO LA LISTA
    for (let i = 0; i < pokemonList.length; i += BATCH_SIZE) {
      const batch = pokemonList.slice(i, i + BATCH_SIZE)
      console.log(
        `🔄 Processing batch from LIST: ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(pokemonList.length / BATCH_SIZE)}`,
      )

      try {
        const batchPromises = batch.map(async (pokemonInfo: PokemonListItem) => {
          const id = extractPokemonIdFromUrl(pokemonInfo.url)
          console.log(`🔍 Fetching details for ${pokemonInfo.name} (ID: ${id}) from LIST`)
          return fetchPokemonWithCache(id)
        })

        const batchResults = await Promise.all(batchPromises)
        const validPokemon = batchResults.filter((pokemon): pokemon is Pokemon => pokemon !== null)

        allPokemon.push(...validPokemon)
        console.log(`✅ LIST batch completed: ${validPokemon.length}/${batch.length} Pokemon loaded`)

        if (onProgress) {
          onProgress(allPokemon.length, pokemonList.length)
        }

        if (i + BATCH_SIZE < pokemonList.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
        }
      } catch (error) {
        console.error(`❌ Error loading LIST batch ${i}-${i + BATCH_SIZE}:`, error)
        // Continue with next batch
      }
    }

    console.log(`🎉 LIST method completed: ${allPokemon.length}/${pokemonList.length} Pokemon loaded`)
  } catch (error) {
    // 🔴 AQUÍ ESTÁ EL FALLBACK - SE EJECUTA SI FALLA LA API DE LISTA
    console.error("❌ LIST API FAILED, falling back to individual ID fetching:", error)
    console.log("🔄 FALLBACK: Using individual Pokemon ID method...")

    // 🟡 MÉTODO FALLBACK: CARGAR POR IDs INDIVIDUALES
    for (let i = startId; i <= endId; i += BATCH_SIZE) {
      const batchEnd = Math.min(i + BATCH_SIZE - 1, endId)
      console.log(`🔄 FALLBACK batch: fetching Pokemon ${i}-${batchEnd} by individual IDs`)

      try {
        const batchPromises: Promise<Pokemon | null>[] = []
        for (let id = i; id <= batchEnd; id++) {
          console.log(`🔍 FALLBACK: Fetching Pokemon ID ${id} directly`)
          batchPromises.push(fetchPokemonWithCache(id))
        }

        const batchResults = await Promise.all(batchPromises)
        const validPokemon = batchResults.filter((pokemon): pokemon is Pokemon => pokemon !== null)

        allPokemon.push(...validPokemon)
        console.log(`✅ FALLBACK batch completed: ${validPokemon.length} Pokemon loaded`)

        // Report progress
        if (onProgress) {
          onProgress(allPokemon.length, totalPokemon)
        }

        // Small delay to prevent overwhelming the API
        if (batchEnd < endId) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
        }
      } catch (error) {
        console.error(`❌ Error loading FALLBACK batch ${i}-${batchEnd}:`, error)
        // Continue with next batch
      }
    }

    console.log(`🎯 FALLBACK method completed: ${allPokemon.length} Pokemon loaded`)
  }

  const sortedPokemon = allPokemon.sort((a, b) => a.id - b.id)
  console.log(`🏁 Final result: ${sortedPokemon.length} Pokemon sorted by ID`)

  // Cache the region as complete - using unknown type assertion for cache compatibility
  pokemonMemoryCache.set(regionCacheKey, sortedPokemon as unknown as Pokemon)

  return sortedPokemon
}

// CLIENT-SIDE batch fetcher (legacy support)
export const fetchPokemonBatch = async (startId: number, endId: number): Promise<Pokemon[]> => {
  const promises: Promise<Pokemon | null>[] = []

  for (let id = startId; id <= endId; id++) {
    promises.push(fetchPokemonWithCache(id))
  }

  const results = await Promise.all(promises)
  return results.filter((pokemon): pokemon is Pokemon => pokemon !== null)
}

// Nueva función para obtener lista de Pokémon con caché
export const fetchPokemonList = async (limit = 1000, offset = 0): Promise<PokemonListItem[]> => {
  const listData = await fetchPokemonListWithCache(limit, offset)
  return listData?.results || []
}
