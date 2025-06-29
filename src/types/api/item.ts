import type { NamedAPIResource, APIResource } from "./pokemon"

// Item API Types
export interface Item {
  id: number
  name: string
  cost: number
  fling_power: number | null
  fling_effect: NamedAPIResource | null
  attributes: NamedAPIResource[]
  category: NamedAPIResource
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: NamedAPIResource
  }>
  flavor_text_entries: Array<{
    text: string
    language: NamedAPIResource
    version_group: NamedAPIResource
  }>
  game_indices: Array<{
    game_index: number
    generation: NamedAPIResource
  }>
  names: Array<{
    name: string
    language: NamedAPIResource
  }>
  sprites: {
    default: string | null
  }
  held_by_pokemon: Array<{
    pokemon: NamedAPIResource
    version_details: Array<{
      rarity: number
      version: NamedAPIResource
    }>
  }>
  baby_trigger_for: NamedAPIResource | null
  machines: Array<{
    machine: APIResource
    version_group: NamedAPIResource
  }>
}
