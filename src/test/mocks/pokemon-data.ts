import type { Pokemon } from "../../types/pokemon"
import type { PokemonAPI } from "../../types/api/pokemon"

export const mockPokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  sprites: {
    front_default: "https://example.com/bulbasaur.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/bulbasaur-artwork.png",
      },
    },
  },
  types: [
    {
      type: {
        name: "grass",
      },
    },
    {
      type: {
        name: "poison",
      },
    },
  ],
  height: 7,
  weight: 69,
  stats: [
    {
      base_stat: 45,
      stat: {
        name: "hp",
      },
    },
    {
      base_stat: 49,
      stat: {
        name: "attack",
      },
    },
    {
      base_stat: 49,
      stat: {
        name: "defense",
      },
    },
    {
      base_stat: 65,
      stat: {
        name: "special-attack",
      },
    },
    {
      base_stat: 65,
      stat: {
        name: "special-defense",
      },
    },
    {
      base_stat: 45,
      stat: {
        name: "speed",
      },
    },
  ],
  abilities: [
    {
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/",
      },
    },
  ],
  moves: [
    {
      move: {
        name: "tackle",
        url: "https://pokeapi.co/api/v2/move/33/",
      },
      version_group_details: [
        {
          level_learned_at: 1,
          move_learn_method: {
            name: "level-up",
          },
        },
      ],
    },
  ],
  base_experience: 64,
}

// Create a version with unique stat values for testing
export const mockPokemonUniqueStats: Pokemon = {
  ...mockPokemon,
  id: 1,
  name: "bulbasaur",
  stats: [
    {
      base_stat: 45,
      stat: {
        name: "hp",
      },
    },
    {
      base_stat: 49,
      stat: {
        name: "attack",
      },
    },
    {
      base_stat: 53,
      stat: {
        name: "defense",
      },
    },
    {
      base_stat: 65,
      stat: {
        name: "special-attack",
      },
    },
    {
      base_stat: 67,
      stat: {
        name: "special-defense",
      },
    },
    {
      base_stat: 51,
      stat: {
        name: "speed",
      },
    },
  ],
}

export const mockPokemonList: Pokemon[] = [
  mockPokemon,
  {
    ...mockPokemon,
    id: 2,
    name: "ivysaur",
    types: [
      {
        type: {
          name: "grass",
        },
      },
      {
        type: {
          name: "poison",
        },
      },
    ],
  },
  {
    ...mockPokemon,
    id: 3,
    name: "venusaur",
    types: [
      {
        type: {
          name: "grass",
        },
      },
      {
        type: {
          name: "poison",
        },
      },
    ],
  },
]

export const mockPokemonAPI: PokemonAPI = {
  id: 1,
  name: "bulbasaur",
  base_experience: 64,
  height: 7,
  is_default: true,
  order: 1,
  weight: 69,
  abilities: [
    {
      is_hidden: false,
      slot: 1,
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/",
      },
    },
  ],
  forms: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon-form/1/",
    },
  ],
  game_indices: [],
  held_items: [],
  location_area_encounters: "https://pokeapi.co/api/v2/pokemon/1/encounters",
  moves: [
    {
      move: {
        name: "tackle",
        url: "https://pokeapi.co/api/v2/move/33/",
      },
      version_group_details: [
        {
          level_learned_at: 1,
          move_learn_method: {
            name: "level-up",
            url: "https://pokeapi.co/api/v2/move-learn-method/1/",
          },
          version_group: {
            name: "red-blue",
            url: "https://pokeapi.co/api/v2/version-group/1/",
          },
        },
      ],
    },
  ],
  species: {
    name: "bulbasaur",
    url: "https://pokeapi.co/api/v2/pokemon-species/1/",
  },
  sprites: {
    front_default: "https://example.com/bulbasaur.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/bulbasaur-artwork.png",
      },
    },
  },
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/",
      },
    },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/",
      },
    },
  ],
}
