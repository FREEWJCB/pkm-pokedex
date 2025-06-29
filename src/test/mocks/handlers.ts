import { http, HttpResponse } from "msw"
import { mockPokemonAPI } from "./pokemon-data"

export const handlers = [
  // Pokemon API
  http.get("https://pokeapi.co/api/v2/pokemon/:id", ({ params }) => {
    const id = params.id as string
    return HttpResponse.json({
      ...mockPokemonAPI,
      id: Number.parseInt(id),
      name: `pokemon-${id}`,
    })
  }),

  // Pokemon Species API
  http.get("https://pokeapi.co/api/v2/pokemon-species/:name", () => {
    return HttpResponse.json({
      id: 1,
      name: "bulbasaur",
      flavor_text_entries: [
        {
          flavor_text: "A strange seed was planted on its back at birth.",
          language: { name: "en" },
          version: { name: "red" },
        },
      ],
      evolution_chain: {
        url: "https://pokeapi.co/api/v2/evolution-chain/1/",
      },
    })
  }),

  // Ability API
  http.get("https://pokeapi.co/api/v2/ability/:id", () => {
    return HttpResponse.json({
      id: 65,
      name: "overgrow",
      effect_entries: [
        {
          effect: "Powers up Grass-type moves when the Pokémon is in trouble.",
          language: { name: "en" },
        },
      ],
    })
  }),

  // Move API
  http.get("https://pokeapi.co/api/v2/move/:id", () => {
    return HttpResponse.json({
      id: 33,
      name: "tackle",
      type: { name: "normal" },
      damage_class: { name: "physical" },
      power: 40,
      accuracy: 100,
      pp: 35,
      effect_entries: [
        {
          short_effect: "Inflicts regular damage with no additional effect.",
          language: { name: "en" },
        },
      ],
    })
  }),

  // Evolution Chain API
  http.get("https://pokeapi.co/api/v2/evolution-chain/:id", () => {
    return HttpResponse.json({
      id: 1,
      chain: {
        species: { name: "bulbasaur" },
        evolves_to: [
          {
            species: { name: "ivysaur" },
            evolution_details: [
              {
                min_level: 16,
                trigger: { name: "level-up" },
              },
            ],
            evolves_to: [
              {
                species: { name: "venusaur" },
                evolution_details: [
                  {
                    min_level: 32,
                    trigger: { name: "level-up" },
                  },
                ],
                evolves_to: [],
              },
            ],
          },
        ],
      },
    })
  }),
]
