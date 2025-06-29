import type { NamedAPIResource, APIResource } from "./pokemon"

// Pokemon Species API Types
export interface PokemonSpecies {
  id: number
  name: string
  order: number
  gender_rate: number
  capture_rate: number
  base_happiness: number
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
  hatch_counter: number
  has_gender_differences: boolean
  forms_switchable: boolean
  growth_rate: NamedAPIResource
  pokedex_numbers: Array<{
    entry_number: number
    pokedex: NamedAPIResource
  }>
  egg_groups: NamedAPIResource[]
  color: NamedAPIResource
  shape: NamedAPIResource
  evolves_from_species: NamedAPIResource | null
  evolution_chain: APIResource
  habitat: NamedAPIResource | null
  generation: NamedAPIResource
  names: Array<{
    name: string
    language: NamedAPIResource
  }>
  pal_park_encounters: Array<{
    base_score: number
    rate: number
    area: NamedAPIResource
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedAPIResource
    version: NamedAPIResource
  }>
  form_descriptions: Array<{
    description: string
    language: NamedAPIResource
  }>
  genera: Array<{
    genus: string
    language: NamedAPIResource
  }>
  varieties: Array<{
    is_default: boolean
    pokemon: NamedAPIResource
  }>
}
