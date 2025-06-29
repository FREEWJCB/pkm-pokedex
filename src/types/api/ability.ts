import type { NamedAPIResource } from "./pokemon"

// Ability API Types
export interface Ability {
  id: number
  name: string
  is_main_series: boolean
  generation: NamedAPIResource
  names: Array<{
    name: string
    language: NamedAPIResource
  }>
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: NamedAPIResource
  }>
  effect_changes: Array<{
    version_group: NamedAPIResource
    effect_entries: Array<{
      effect: string
      language: NamedAPIResource
    }>
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedAPIResource
    version_group: NamedAPIResource
  }>
  pokemon: Array<{
    is_hidden: boolean
    slot: number
    pokemon: NamedAPIResource
  }>
}
