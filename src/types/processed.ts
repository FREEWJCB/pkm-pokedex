// Processed data types for our components

export interface ProcessedMove {
  name: string
  type: string
  category: string
  power: number | null
  accuracy: number | null
  pp: number
  description: string
  learnMethod: string
  level?: number
}

export interface ProcessedAbility {
  name: string
  description: string
}

export interface ProcessedEvolutionPokemon {
  id: number
  name: string
  sprite: string
  types: Array<{
    type: {
      name: string
    }
  }>
}

export interface ProcessedEvolutionItem {
  name: string
  sprite: string
}

export interface ProcessedEvolution {
  from: ProcessedEvolutionPokemon
  to: ProcessedEvolutionPokemon
  method: string
  level?: number
  item?: string
  itemSprite?: string
  condition?: string
}

export interface ProcessedGameInfo {
  game: string
  version: string
  description: string
}

export interface ProcessedTypeEffectiveness {
  type: string
  category: "weak-to" | "resistant-to" | "immune-to" | "strong-against" | "weak-against" | "no-effect-against"
  multiplier: string
  description: string
}

export interface ProcessedStat {
  stat: string
  value: number
  percentage: number
  rating: "low" | "medium" | "high"
  color: string
  bg: string
}
