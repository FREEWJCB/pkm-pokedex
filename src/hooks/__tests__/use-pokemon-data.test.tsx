import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "../../test/utils"
import { usePokemonData } from "../use-pokemon-data"
import { mockPokemon } from "../../test/mocks/pokemon-data"
import type { Ability } from "../../types/api/ability"
import type { Move } from "../../types/api/move"
import type { PokemonSpecies } from "../../types/api/species"
import type { EvolutionChain } from "../../types/api/evolution"

// Mock fetch globally
const mockFetch = vi.fn<(input: RequestInfo, init?: RequestInit) => Promise<Response>>()
global.fetch = mockFetch as typeof fetch

describe("usePokemonData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  it("initializes with empty data", () => {
    const { result } = renderHook(() => usePokemonData(null))

    expect(result.current.abilityDescriptions).toEqual({})
    expect(result.current.loadingAbilities).toBe(false)
    expect(result.current.moves).toEqual([])
    expect(result.current.loadingMoves).toBe(false)
    expect(result.current.evolutionData).toEqual([])
    expect(result.current.loadingEvolution).toBe(false)
    expect(result.current.gameInfo).toEqual([])
    expect(result.current.loadingGameInfo).toBe(false)
  })

  it("calculates type effectiveness correctly", () => {
    const { result } = renderHook(() => usePokemonData(mockPokemon))

    expect(result.current.effectivenessData).toBeDefined()
    expect(Array.isArray(result.current.effectivenessData)).toBe(true)

    // Grass/Poison should be weak to fire, ice, flying, psychic
    const weaknesses = result.current.effectivenessData
      .filter((item: { category: string }) => item.category === "weak-to")
      .map((item: { type: string }) => item.type)

    expect(weaknesses).toContain("fire")
    expect(weaknesses).toContain("ice")
    expect(weaknesses).toContain("flying")
    expect(weaknesses).toContain("psychic")
  })

  it("fetches ability descriptions", async () => {
    const mockAbility: Ability = {
      id: 65,
      name: "overgrow",
      is_main_series: true,
      generation: { name: "generation-i", url: "test" },
      names: [],
      effect_entries: [
        {
          effect: "Powers up Grass-type moves when HP is low.",
          short_effect: "Powers up Grass-type moves when HP is low.",
          language: { name: "en", url: "test" },
        },
      ],
      effect_changes: [],
      flavor_text_entries: [],
      pokemon: [],
    }

    // Mock the specific URL that the hook will call
    mockFetch.mockImplementation((url) => {
      if (typeof url === "string" && url.includes("ability/65")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAbility),
        } as Response)
      }
      return Promise.reject(new Error("Unexpected URL"))
    })

    const { result } = renderHook(() => usePokemonData(mockPokemon))

    // Wait for loading to start
    await waitFor(() => {
      expect(result.current.loadingAbilities).toBe(true)
    })

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loadingAbilities).toBe(false)
    })

    expect(result.current.abilityDescriptions.overgrow).toBe("Powers up Grass-type moves when HP is low.")
  })

  it("fetches move data", async () => {
    const mockMove: Move = {
      id: 33,
      name: "tackle",
      accuracy: 100,
      effect_chance: null,
      pp: 35,
      priority: 0,
      power: 40,
      contest_combos: { normal: null, super: null },
      contest_type: null,
      contest_effect: null,
      damage_class: { name: "physical", url: "test" },
      effect_entries: [
        {
          effect: "Inflicts regular damage.",
          short_effect: "Inflicts regular damage.",
          language: { name: "en", url: "test" },
        },
      ],
      effect_changes: [],
      learned_by_pokemon: [],
      flavor_text_entries: [],
      generation: { name: "generation-i", url: "test" },
      machines: [],
      meta: null,
      names: [],
      past_values: [],
      stat_changes: [],
      super_contest_effect: null,
      target: { name: "selected-pokemon", url: "test" },
      type: { name: "normal", url: "test" },
    }

    // Mock the specific URL that the hook will call for moves
    mockFetch.mockImplementation((url) => {
      if (typeof url === "string" && url.includes("move/33")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMove),
        } as Response)
      }
      return Promise.reject(new Error("Unexpected URL"))
    })

    const { result } = renderHook(() => usePokemonData(mockPokemon))

    // Wait for loading to start
    await waitFor(() => {
      expect(result.current.loadingMoves).toBe(true)
    })

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.loadingMoves).toBe(false)
      },
      { timeout: 2000 },
    )

    expect(result.current.moves).toHaveLength(1)
    expect(result.current.moves[0]).toMatchObject({
      name: "tackle",
      type: "normal",
      category: "physical",
      power: 40,
      accuracy: 100,
      pp: 35,
      learnMethod: "level-up",
      level: 1,
    })
  })

  it("fetches species and game info", async () => {
    const mockSpecies: PokemonSpecies = {
      id: 1,
      name: "bulbasaur",
      order: 1,
      gender_rate: 1,
      capture_rate: 45,
      base_happiness: 50,
      is_baby: false,
      is_legendary: false,
      is_mythical: false,
      hatch_counter: 20,
      has_gender_differences: false,
      forms_switchable: false,
      growth_rate: { name: "medium-slow", url: "test" },
      pokedex_numbers: [],
      egg_groups: [],
      color: { name: "green", url: "test" },
      shape: { name: "quadruped", url: "test" },
      evolves_from_species: null,
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
      habitat: null,
      generation: { name: "generation-i", url: "test" },
      names: [],
      pal_park_encounters: [],
      flavor_text_entries: [
        {
          flavor_text: "A strange seed was planted on its back at birth.",
          language: { name: "en", url: "test" },
          version: { name: "red", url: "test" },
        },
      ],
      form_descriptions: [],
      genera: [],
      varieties: [],
    }

    const mockEvolutionChain: EvolutionChain = {
      id: 1,
      baby_trigger_item: null,
      chain: {
        is_baby: false,
        species: { name: "bulbasaur", url: "test" },
        evolution_details: [],
        evolves_to: [],
      },
    }

    // Mock multiple URLs that the hook will call
    mockFetch.mockImplementation((url) => {
      if (typeof url === "string") {
        if (url.includes("pokemon-species/bulbasaur")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSpecies),
          } as Response)
        }
        if (url.includes("evolution-chain/1")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockEvolutionChain),
          } as Response)
        }
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`))
    })

    const { result } = renderHook(() => usePokemonData(mockPokemon))

    // Wait for loading to start
    await waitFor(() => {
      expect(result.current.loadingGameInfo).toBe(true)
    })

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.loadingGameInfo).toBe(false)
      },
      { timeout: 2000 },
    )

    expect(result.current.gameInfo).toHaveLength(1)
    expect(result.current.gameInfo[0]).toMatchObject({
      game: "Red",
      version: "red",
      description: "A strange seed was planted on its back at birth.",
    })
  })

  it("handles fetch errors gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => usePokemonData(mockPokemon))

    // Wait for all loading to complete
    await waitFor(
      () => {
        expect(result.current.loadingAbilities).toBe(false)
        expect(result.current.loadingMoves).toBe(false)
        expect(result.current.loadingGameInfo).toBe(false)
        expect(result.current.loadingEvolution).toBe(false)
      },
      { timeout: 5000 },
    )

    expect(result.current.abilityDescriptions.overgrow).toBe("Description unavailable")
  })

  it("does not fetch data when pokemon is null", () => {
    const { result } = renderHook(() => usePokemonData(null))

    expect(result.current.loadingAbilities).toBe(false)
    expect(result.current.loadingMoves).toBe(false)
    expect(result.current.loadingEvolution).toBe(false)
    expect(result.current.loadingGameInfo).toBe(false)

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("handles empty responses gracefully", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    const { result } = renderHook(() => usePokemonData(mockPokemon))

    // Wait for all loading to complete
    await waitFor(
      () => {
        expect(result.current.loadingAbilities).toBe(false)
        expect(result.current.loadingMoves).toBe(false)
        expect(result.current.loadingGameInfo).toBe(false)
        expect(result.current.loadingEvolution).toBe(false)
      },
      { timeout: 5000 },
    )

    expect(result.current.abilityDescriptions.overgrow).toBe("Description unavailable")
  })

  it("handles concurrent requests correctly", async () => {
    const mockAbility: Ability = {
      id: 65,
      name: "overgrow",
      is_main_series: true,
      generation: { name: "generation-i", url: "test" },
      names: [],
      effect_entries: [
        {
          effect: "Powers up Grass-type moves when HP is low.",
          short_effect: "Powers up Grass-type moves when HP is low.",
          language: { name: "en", url: "test" },
        },
      ],
      effect_changes: [],
      flavor_text_entries: [],
      pokemon: [],
    }

    const mockMove: Move = {
      id: 33,
      name: "tackle",
      accuracy: 100,
      effect_chance: null,
      pp: 35,
      priority: 0,
      power: 40,
      contest_combos: { normal: null, super: null },
      contest_type: null,
      contest_effect: null,
      damage_class: { name: "physical", url: "test" },
      effect_entries: [
        {
          effect: "Inflicts regular damage.",
          short_effect: "Inflicts regular damage.",
          language: { name: "en", url: "test" },
        },
      ],
      effect_changes: [],
      learned_by_pokemon: [],
      flavor_text_entries: [],
      generation: { name: "generation-i", url: "test" },
      machines: [],
      meta: null,
      names: [],
      past_values: [],
      stat_changes: [],
      super_contest_effect: null,
      target: { name: "selected-pokemon", url: "test" },
      type: { name: "normal", url: "test" },
    }

    const mockSpecies: PokemonSpecies = {
      id: 1,
      name: "bulbasaur",
      order: 1,
      gender_rate: 1,
      capture_rate: 45,
      base_happiness: 50,
      is_baby: false,
      is_legendary: false,
      is_mythical: false,
      hatch_counter: 20,
      has_gender_differences: false,
      forms_switchable: false,
      growth_rate: { name: "medium-slow", url: "test" },
      pokedex_numbers: [],
      egg_groups: [],
      color: { name: "green", url: "test" },
      shape: { name: "quadruped", url: "test" },
      evolves_from_species: null,
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
      habitat: null,
      generation: { name: "generation-i", url: "test" },
      names: [],
      pal_park_encounters: [],
      flavor_text_entries: [
        {
          flavor_text: "A strange seed was planted on its back at birth.",
          language: { name: "en", url: "test" },
          version: { name: "red", url: "test" },
        },
      ],
      form_descriptions: [],
      genera: [],
      varieties: [],
    }

    // Mock all URLs that might be called
    mockFetch.mockImplementation((url) => {
      if (typeof url === "string") {
        if (url.includes("ability/65")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAbility),
          } as Response)
        }
        if (url.includes("move/33")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockMove),
          } as Response)
        }
        if (url.includes("pokemon-species/bulbasaur")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSpecies),
          } as Response)
        }
        if (url.includes("evolution-chain/1")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 1,
                baby_trigger_item: null,
                chain: {
                  is_baby: false,
                  species: { name: "bulbasaur", url: "test" },
                  evolution_details: [],
                  evolves_to: [],
                },
              }),
          } as Response)
        }
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`))
    })

    const { result } = renderHook(() => usePokemonData(mockPokemon))

    // Wait for all loading to complete
    await waitFor(
      () => {
        expect(result.current.loadingAbilities).toBe(false)
        expect(result.current.loadingMoves).toBe(false)
        expect(result.current.loadingGameInfo).toBe(false)
        expect(result.current.loadingEvolution).toBe(false)
      },
      { timeout: 5000 },
    )

    // Verify all data was loaded
    expect(result.current.abilityDescriptions.overgrow).toBe("Powers up Grass-type moves when HP is low.")
    expect(result.current.moves).toHaveLength(1)
    expect(result.current.gameInfo).toHaveLength(1)
  })
})
