import type { PokemonRegion } from "../types/pokemon"

export const POKEMON_REGIONS: PokemonRegion[] = [
  {
    id: "kanto",
    name: "Kanto",
    startId: 1,
    endId: 151,
    generation: 1,
    image: "/regions/kanto.png",
    description: "The original region where it all began",
  },
  {
    id: "johto",
    name: "Johto",
    startId: 152,
    endId: 251,
    generation: 2,
    image: "/regions/johto.png",
    description: "Land of tradition and legendary beasts",
  },
  {
    id: "hoenn",
    name: "Hoenn",
    startId: 252,
    endId: 386,
    generation: 3,
    image: "/regions/hoenn.png",
    description: "A region of land and sea",
  },
  {
    id: "sinnoh",
    name: "Sinnoh",
    startId: 387,
    endId: 493,
    generation: 4,
    image: "/regions/sinnoh.png",
    description: "The land of myths and legends",
  },
  {
    id: "unova",
    name: "Unova",
    startId: 494,
    endId: 649,
    generation: 5,
    image: "/regions/unova.png",
    description: "A region far from others",
  },
  {
    id: "kalos",
    name: "Kalos",
    startId: 650,
    endId: 721,
    generation: 6,
    image: "/regions/kalos.png",
    description: "The region of beauty and art",
  },
  {
    id: "alola",
    name: "Alola",
    startId: 722,
    endId: 809,
    generation: 7,
    image: "/regions/alola.png",
    description: "Tropical islands with unique forms",
  },
  {
    id: "galar",
    name: "Galar",
    startId: 810,
    endId: 898,
    generation: 8,
    image: "/regions/galar.png",
    description: "Industrial region with Dynamax",
  },
  {
    id: "paldea",
    name: "Paldea",
    startId: 899,
    endId: 1025,
    generation: 9,
    image: "/regions/paldea.png",
    description: "Open world of adventure",
  },
]

export const getRegionByPokemonId = (id: number): PokemonRegion | undefined => {
  return POKEMON_REGIONS.find((region) => id >= region.startId && id <= region.endId)
}

export const getRegionById = (regionId: string): PokemonRegion | undefined => {
  return POKEMON_REGIONS.find((region) => region.id === regionId)
}

export const getRegionInfo = (regionId: string): PokemonRegion | undefined => {
  return getRegionById(regionId)
}

export const getRegionPokemonCount = (regionId: string): number => {
  const region = getRegionById(regionId)
  if (!region) return 0
  return region.endId - region.startId + 1
}

export const getRegionOffset = (regionId: string): number => {
  const region = getRegionById(regionId)
  if (!region) return 0
  return region.startId - 1 // API usa offset basado en 0
}
