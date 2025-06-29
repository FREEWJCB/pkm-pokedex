"use client"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar = ({ value, onChange, placeholder = "Search Pokemon..." }: SearchBarProps) => {
  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "16px",
          lineHeight: "1.5",
        }}
      />
      <button
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center"
        style={{ cursor: "pointer" }}
      >
        <span className="text-lg">🔍</span>
      </button>
    </div>
  )
}
