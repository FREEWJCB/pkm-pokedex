// Type effectiveness chart - what types are effective against what
export const TYPE_EFFECTIVENESS: Record<
  string,
  {
    weakTo: string[] // Types this type is weak to (takes 2x damage)
    resistantTo: string[] // Types this type resists (takes 0.5x damage)
    immuneTo: string[] // Types this type is immune to (takes 0x damage)
    strongAgainst: string[] // Types this type is strong against (deals 2x damage)
    weakAgainst: string[] // Types this type is weak against (deals 0.5x damage)
    noEffectAgainst: string[] // Types this type has no effect against (deals 0x damage)
  }
> = {
  normal: {
    weakTo: ["fighting"],
    resistantTo: [],
    immuneTo: ["ghost"],
    strongAgainst: [],
    weakAgainst: ["rock", "steel"],
    noEffectAgainst: ["ghost"],
  },
  fire: {
    weakTo: ["water", "ground", "rock"],
    resistantTo: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immuneTo: [],
    strongAgainst: ["grass", "ice", "bug", "steel"],
    weakAgainst: ["fire", "water", "rock", "dragon"],
    noEffectAgainst: [],
  },
  water: {
    weakTo: ["electric", "grass"],
    resistantTo: ["fire", "water", "ice", "steel"],
    immuneTo: [],
    strongAgainst: ["fire", "ground", "rock"],
    weakAgainst: ["water", "grass", "dragon"],
    noEffectAgainst: [],
  },
  electric: {
    weakTo: ["ground"],
    resistantTo: ["electric", "flying", "steel"],
    immuneTo: [],
    strongAgainst: ["water", "flying"],
    weakAgainst: ["electric", "grass", "dragon"],
    noEffectAgainst: ["ground"],
  },
  grass: {
    weakTo: ["fire", "ice", "poison", "flying", "bug"],
    resistantTo: ["water", "electric", "grass", "ground"],
    immuneTo: [],
    strongAgainst: ["water", "ground", "rock"],
    weakAgainst: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"],
    noEffectAgainst: [],
  },
  ice: {
    weakTo: ["fire", "fighting", "rock", "steel"],
    resistantTo: ["ice"],
    immuneTo: [],
    strongAgainst: ["grass", "ground", "flying", "dragon"],
    weakAgainst: ["fire", "water", "ice", "steel"],
    noEffectAgainst: [],
  },
  fighting: {
    weakTo: ["flying", "psychic", "fairy"],
    resistantTo: ["bug", "rock", "dark"],
    immuneTo: [],
    strongAgainst: ["normal", "ice", "rock", "dark", "steel"],
    weakAgainst: ["poison", "flying", "psychic", "bug", "fairy"],
    noEffectAgainst: ["ghost"],
  },
  poison: {
    weakTo: ["ground", "psychic"],
    resistantTo: ["grass", "fighting", "poison", "bug", "fairy"],
    immuneTo: [],
    strongAgainst: ["grass", "fairy"],
    weakAgainst: ["poison", "ground", "rock", "ghost"],
    noEffectAgainst: ["steel"],
  },
  ground: {
    weakTo: ["water", "grass", "ice"],
    resistantTo: ["poison", "rock"],
    immuneTo: ["electric"],
    strongAgainst: ["fire", "electric", "poison", "rock", "steel"],
    weakAgainst: ["grass", "bug"],
    noEffectAgainst: ["flying"],
  },
  flying: {
    weakTo: ["electric", "ice", "rock"],
    resistantTo: ["grass", "fighting", "bug"],
    immuneTo: ["ground"],
    strongAgainst: ["grass", "fighting", "bug"],
    weakAgainst: ["electric", "rock", "steel"],
    noEffectAgainst: [],
  },
  psychic: {
    weakTo: ["bug", "ghost", "dark"],
    resistantTo: ["fighting", "psychic"],
    immuneTo: [],
    strongAgainst: ["fighting", "poison"],
    weakAgainst: ["psychic", "steel"],
    noEffectAgainst: ["dark"],
  },
  bug: {
    weakTo: ["fire", "flying", "rock"],
    resistantTo: ["grass", "fighting", "ground"],
    immuneTo: [],
    strongAgainst: ["grass", "psychic", "dark"],
    weakAgainst: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"],
    noEffectAgainst: [],
  },
  rock: {
    weakTo: ["water", "grass", "fighting", "ground", "steel"],
    resistantTo: ["normal", "fire", "poison", "flying"],
    immuneTo: [],
    strongAgainst: ["fire", "ice", "flying", "bug"],
    weakAgainst: ["fighting", "ground", "steel"],
    noEffectAgainst: [],
  },
  ghost: {
    weakTo: ["ghost", "dark"],
    resistantTo: ["poison", "bug"],
    immuneTo: ["normal", "fighting"],
    strongAgainst: ["psychic", "ghost"],
    weakAgainst: ["dark"],
    noEffectAgainst: ["normal"],
  },
  dragon: {
    weakTo: ["ice", "dragon", "fairy"],
    resistantTo: ["fire", "water", "electric", "grass"],
    immuneTo: [],
    strongAgainst: ["dragon"],
    weakAgainst: ["steel"],
    noEffectAgainst: ["fairy"],
  },
  dark: {
    weakTo: ["fighting", "bug", "fairy"],
    resistantTo: ["ghost", "dark"],
    immuneTo: ["psychic"],
    strongAgainst: ["psychic", "ghost"],
    weakAgainst: ["fighting", "dark", "fairy"],
    noEffectAgainst: [],
  },
  steel: {
    weakTo: ["fire", "fighting", "ground"],
    resistantTo: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"],
    immuneTo: ["poison"],
    strongAgainst: ["ice", "rock", "fairy"],
    weakAgainst: ["fire", "water", "electric", "steel"],
    noEffectAgainst: [],
  },
  fairy: {
    weakTo: ["poison", "steel"],
    resistantTo: ["fighting", "bug", "dark"],
    immuneTo: ["dragon"],
    strongAgainst: ["fighting", "dragon", "dark"],
    weakAgainst: ["fire", "poison", "steel"],
    noEffectAgainst: [],
  },
}

export const calculateTypeEffectiveness = (pokemonTypes: string[]) => {
  const effectiveness = {
    weakTo: new Set<string>(),
    resistantTo: new Set<string>(),
    immuneTo: new Set<string>(),
    strongAgainst: new Set<string>(),
    weakAgainst: new Set<string>(),
    noEffectAgainst: new Set<string>(),
  }

  // For dual types, we need to calculate combined effectiveness
  const typeMultipliers: Record<string, number> = {}

  pokemonTypes.forEach((type) => {
    const typeData = TYPE_EFFECTIVENESS[type.toLowerCase()]
    if (!typeData) return

    // Calculate defensive effectiveness (what affects this Pokémon)
    typeData.weakTo.forEach((attackingType) => {
      typeMultipliers[attackingType] = (typeMultipliers[attackingType] || 1) * 2
    })

    typeData.resistantTo.forEach((attackingType) => {
      typeMultipliers[attackingType] = (typeMultipliers[attackingType] || 1) * 0.5
    })

    typeData.immuneTo.forEach((attackingType) => {
      typeMultipliers[attackingType] = 0
    })

    // Offensive effectiveness (what this Pokémon is strong/weak against)
    typeData.strongAgainst.forEach((defendingType) => effectiveness.strongAgainst.add(defendingType))
    typeData.weakAgainst.forEach((defendingType) => effectiveness.weakAgainst.add(defendingType))
    typeData.noEffectAgainst.forEach((defendingType) => effectiveness.noEffectAgainst.add(defendingType))
  })

  // Categorize based on final multipliers
  Object.entries(typeMultipliers).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      effectiveness.immuneTo.add(type)
    } else if (multiplier >= 2) {
      effectiveness.weakTo.add(type)
    } else if (multiplier <= 0.5) {
      effectiveness.resistantTo.add(type)
    }
  })

  return {
    weakTo: Array.from(effectiveness.weakTo),
    resistantTo: Array.from(effectiveness.resistantTo),
    immuneTo: Array.from(effectiveness.immuneTo),
    strongAgainst: Array.from(effectiveness.strongAgainst),
    weakAgainst: Array.from(effectiveness.weakAgainst),
    noEffectAgainst: Array.from(effectiveness.noEffectAgainst),
  }
}
