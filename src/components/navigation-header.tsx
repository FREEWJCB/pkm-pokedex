"use client"

interface NavigationHeaderProps {
  activeTab?: string
}

const navigationTabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "pokedex", label: "Pokédex", icon: "📱", active: true },
  { id: "games", label: "Video Games & Apps", icon: "🎮" },
  { id: "tcg", label: "Trading Card Game", icon: "🃏" },
  { id: "animation", label: "Animation", icon: "📺" },
  { id: "play", label: "Play! Pokémon Events", icon: "🎯" },
  { id: "news", label: "News", icon: "📰" },
]

export const NavigationHeader = ({ activeTab = "pokedex" }: NavigationHeaderProps) => {
  return (
    <div className="pokemon-header-bg border-b">
      {/* Pokemon Logos Row */}
      <div className="flex justify-center items-center gap-2 py-2 px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <div className="bg-yellow-400 px-3 py-1 rounded text-black font-bold text-sm">Pokémon</div>
          <div className="bg-yellow-400 px-3 py-1 rounded text-black font-bold text-sm">Shop</div>
          <div className="bg-yellow-400 px-3 py-1 rounded text-black font-bold text-sm">About Us</div>
          <div className="bg-red-600 px-3 py-1 rounded text-white font-bold text-sm">TCG</div>
          <div className="bg-green-600 px-3 py-1 rounded text-white font-bold text-sm">Pokémon Z-A</div>
          <div className="bg-blue-500 px-3 py-1 rounded text-white font-bold text-sm">Forums</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex justify-center">
        <div className="flex overflow-x-auto">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-4 transition-colors ${
                tab.id === activeTab
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700 border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
