export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  height: number
  weight: number
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
  }>
  moves: Array<{
    move: {
      name: string
      url: string
    }
    version_group_details: Array<{
      level_learned_at: number
      move_learn_method: {
        name: string
      }
    }>
  }>
  base_experience?: number
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonType {
  name: string
  color: string
}

export interface FilterOptions {
  search: string
  type: string
  secondaryType?: string
  dualType?: string
  heightRange?: string
  weightRange?: string
  sortBy: "id" | "name" | "height" | "weight"
  sortOrder: "asc" | "desc"
  region: string
}

export interface PokemonRegion {
  id: string
  name: string
  startId: number
  endId: number
  generation: number
  image: string
  description: string
}
