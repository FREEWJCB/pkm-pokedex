import type { NamedAPIResource, APIResource } from "./pokemon"

// Move API Types
export interface Move {
  id: number
  name: string
  accuracy: number | null
  effect_chance: number | null
  pp: number
  priority: number
  power: number | null
  contest_combos: {
    normal: {
      use_before: NamedAPIResource[]
      use_after: NamedAPIResource[]
    } | null
    super: {
      use_before: NamedAPIResource[]
      use_after: NamedAPIResource[]
    } | null
  }
  contest_type: NamedAPIResource | null
  contest_effect: APIResource | null
  damage_class: NamedAPIResource
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
  learned_by_pokemon: NamedAPIResource[]
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedAPIResource
    version_group: NamedAPIResource
  }>
  generation: NamedAPIResource
  machines: Array<{
    machine: APIResource
    version_group: NamedAPIResource
  }>
  meta: {
    ailment: NamedAPIResource
    category: NamedAPIResource
    min_hits: number | null
    max_hits: number | null
    min_turns: number | null
    max_turns: number | null
    drain: number
    healing: number
    crit_rate: number
    ailment_chance: number
    flinch_chance: number
    stat_chance: number
  } | null
  names: Array<{
    name: string
    language: NamedAPIResource
  }>
  past_values: Array<{
    accuracy: number | null
    effect_chance: number | null
    power: number | null
    pp: number | null
    effect_entries: Array<{
      effect: string
      short_effect: string
      language: NamedAPIResource
    }>
    type: NamedAPIResource | null
    version_group: NamedAPIResource
  }>
  stat_changes: Array<{
    change: number
    stat: NamedAPIResource
  }>
  super_contest_effect: APIResource | null
  target: NamedAPIResource
  type: NamedAPIResource
}
