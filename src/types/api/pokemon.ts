// Pokemon API Types
export interface PokeAPIResource {
  name: string
  url: string
}

export interface NamedAPIResource {
  name: string
  url: string
}

export interface APIResource {
  url: string
}

export interface PokemonSprites {
  front_default: string
  back_default?: string
  front_shiny?: string
  back_shiny?: string
  other: {
    "official-artwork": {
      front_default: string
      front_shiny?: string
    }
    home?: {
      front_default?: string
      front_shiny?: string
    }
    showdown?: {
      front_default?: string
      back_default?: string
    }
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

export interface PokemonType {
  slot: number
  type: NamedAPIResource
}

export interface PokemonAbility {
  is_hidden: boolean
  slot: number
  ability: NamedAPIResource
}

export interface PokemonMove {
  move: NamedAPIResource
  version_group_details: Array<{
    level_learned_at: number
    move_learn_method: NamedAPIResource
    version_group: NamedAPIResource
  }>
}

export interface PokemonGameIndex {
  game_index: number
  version: NamedAPIResource
}

export interface PokemonHeldItem {
  item: NamedAPIResource
  version_details: Array<{
    rarity: number
    version: NamedAPIResource
  }>
}

// Main Pokemon interface (from PokeAPI)
export interface PokemonAPI {
  id: number
  name: string
  base_experience: number
  height: number
  is_default: boolean
  order: number
  weight: number
  abilities: PokemonAbility[]
  forms: NamedAPIResource[]
  game_indices: PokemonGameIndex[]
  held_items: PokemonHeldItem[]
  location_area_encounters: string
  moves: PokemonMove[]
  species: NamedAPIResource
  sprites: PokemonSprites
  stats: PokemonStat[]
  types: PokemonType[]
  past_types?: Array<{
    generation: NamedAPIResource
    types: PokemonType[]
  }>
}
