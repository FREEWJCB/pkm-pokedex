# Pokémon Knowledge Manager (PKM)

A modern, responsive Pokémon encyclopedia built with Next.js, TypeScript, and Tailwind CSS. This application provides comprehensive information about Pokémon from all generations, featuring advanced search capabilities, detailed Pokémon data, and an intuitive user interface.

## 🌟 Features

- **Complete Pokédex**: Browse Pokémon from all 9 generations (Kanto to Paldea)
- **Advanced Search**: Search by name, number, type, abilities, and more
- **Detailed Information**: View stats, abilities, moves, evolution chains, and game information
- **Region Navigation**: Explore Pokémon by their original regions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Smart caching system with fallback mechanisms
- **Type Effectiveness**: Interactive type effectiveness chart
- **Evolution Trees**: Visual evolution chain displays
- **Move Database**: Comprehensive move information with learning methods

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/pokemon-knowledge-manager.git
   cd pokemon-knowledge-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   ├── loading.tsx        # Global loading component
│   └── page.tsx           # Home page component
├── components/            # Reusable UI components
│   ├── __tests__/         # Component tests
│   ├── icons/             # Custom icon components
│   ├── modal/             # Modal-related components
│   │   ├── tabs/          # Modal tab components
│   │   └── __tests__/     # Modal component tests
│   ├── advanced-search.tsx    # Advanced search filters
│   ├── filter-bar.tsx         # Filter controls
│   ├── loading-spinner.tsx    # Loading animation
│   ├── navigation-header.tsx  # Main navigation
│   ├── pagination.tsx         # Pagination controls
│   ├── pokemon-card.tsx       # Individual Pokémon card
│   ├── pokemon-grid.tsx       # Grid layout for Pokémon
│   ├── pokemon-modal.tsx      # Detailed Pokémon modal
│   ├── region-info.tsx        # Region information display
│   ├── region-navigation.tsx  # Region selection
│   ├── search-bar.tsx         # Search input component
│   ├── sort-dropdown.tsx      # Sorting options
│   └── surprise-button.tsx    # Random Pokémon selector
├── hooks/                 # Custom React hooks
│   ├── __tests__/         # Hook tests
│   ├── use-pokemon.ts     # Main Pokémon data hook
│   └── use-pokemon-data.ts    # Individual Pokémon data hook
├── lib/                   # Utility libraries
│   ├── __tests__/         # Library tests
│   └── pokemon-cache.ts   # Caching and API functions
├── test/                  # Test configuration and utilities
│   ├── mocks/             # Mock data and handlers
│   ├── setup.ts           # Test setup configuration
│   └── utils.tsx          # Test utility functions
├── types/                 # TypeScript type definitions
│   ├── api/               # API response types
│   ├── pokemon.ts         # Core Pokémon types
│   └── processed.ts       # Processed data types
└── utils/                 # Utility functions
    ├── __tests__/         # Utility tests
    ├── pokemon-regions.ts # Region data and helpers
    ├── pokemon-types.ts   # Type definitions and colors
    └── type-effectiveness.ts  # Type effectiveness calculations
\`\`\`

### Key Directories Explained

- **`app/`**: Next.js 13+ App Router structure with layouts and pages
- **`components/`**: Reusable UI components organized by functionality
- **`hooks/`**: Custom React hooks for state management and data fetching
- **`lib/`**: Core business logic, API calls, and caching mechanisms
- **`types/`**: TypeScript definitions for type safety
- **`utils/`**: Helper functions and data processing utilities
- **`test/`**: Testing infrastructure and mock data

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### API Configuration

\`\`\`env
# Base URL for the Pokémon API
NEXT_PUBLIC_POKEMON_API_BASE_URL=https://pokeapi.co/api/v2
\`\`\`
**Purpose**: Sets the base URL for all API calls. Allows switching to different API endpoints or local development servers.

\`\`\`env
# Request timeout in milliseconds
NEXT_PUBLIC_POKEMON_API_TIMEOUT=10000
\`\`\`
**Purpose**: Maximum time to wait for API responses before timing out (10 seconds default).

\`\`\`env
# Number of retry attempts for failed requests
NEXT_PUBLIC_POKEMON_API_RETRY_ATTEMPTS=3
\`\`\`
**Purpose**: How many times to retry failed API requests with exponential backoff.

\`\`\`env
# Number of Pokémon to process simultaneously
NEXT_PUBLIC_POKEMON_API_BATCH_SIZE=10
\`\`\`
**Purpose**: Controls concurrent API requests to balance performance and API rate limits.

\`\`\`env
# Delay between API request batches in milliseconds
NEXT_PUBLIC_POKEMON_API_DELAY_MS=150
\`\`\`
**Purpose**: Pause between batches to prevent overwhelming the API server.

### Pagination Configuration

\`\`\`env
# Number of Pokémon displayed per page
NEXT_PUBLIC_ITEMS_PER_PAGE=20
\`\`\`
**Purpose**: Controls pagination size. Higher values show more Pokémon per page but may impact performance.

### Cache Configuration

\`\`\`env
# Server-side cache duration in minutes
NEXT_PUBLIC_CACHE_TTL_MINUTES=60
\`\`\`
**Purpose**: How long to cache API responses on the server (1 hour default).

\`\`\`env
# Client-side memory cache duration in minutes
NEXT_PUBLIC_MEMORY_CACHE_TTL_MINUTES=30
\`\`\`
**Purpose**: How long to keep data in browser memory cache (30 minutes default).

### Debug Configuration

\`\`\`env
# Enable detailed API call logging
NEXT_PUBLIC_DEBUG_API_CALLS=false
\`\`\`
**Purpose**: Shows detailed logs for debugging API issues. Set to `true` for development.

\`\`\`env
# Enable general API request logging
NEXT_PUBLIC_ENABLE_API_LOGGING=true
\`\`\`
**Purpose**: Logs API requests for monitoring. Useful for tracking API usage.

## 🔌 API Information

This project uses the [PokéAPI](https://pokeapi.co/), a free and open RESTful API for Pokémon data.

### API Features Used

- **Pokémon Data**: Basic information, stats, types, abilities
- **Species Data**: Descriptions, evolution chains, habitat information
- **Move Data**: Move details, power, accuracy, descriptions
- **Ability Data**: Ability descriptions and effects
- **Evolution Chains**: Complete evolution trees
- **Type Data**: Type effectiveness and relationships

### API Endpoints

- `GET /pokemon/{id}` - Individual Pokémon data
- `GET /pokemon?limit={limit}&offset={offset}` - Pokémon list
- `GET /pokemon-species/{id}` - Species information
- `GET /evolution-chain/{id}` - Evolution data
- `GET /move/{id}` - Move information
- `GET /ability/{id}` - Ability details

### Rate Limiting

The application implements smart rate limiting:
- Batch processing to reduce concurrent requests
- Configurable delays between batches
- Retry logic with exponential backoff
- Comprehensive caching to minimize API calls

## 🏗️ Architecture

### Data Flow

1. **User Interaction**: User selects region or searches for Pokémon
2. **Hook Processing**: `use-pokemon` hook manages state and triggers data fetching
3. **API Layer**: `pokemon-cache.ts` handles API calls with caching
4. **Cache Strategy**: Multi-level caching (server + client memory)
5. **UI Updates**: Components receive data and update the interface

### Caching Strategy

The application uses a sophisticated multi-level caching system:

1. **Server-Side Cache**: Next.js `unstable_cache` for server-rendered data
2. **Memory Cache**: Client-side in-memory cache for fast access
3. **Fallback Logic**: Graceful degradation when APIs fail

### Performance Optimizations

- **Lazy Loading**: Components and data loaded on demand
- **Batch Processing**: Multiple API requests processed in batches
- **Smart Pagination**: Only load visible data
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting with Next.js

## 🧪 Testing

The project includes comprehensive testing:

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Test Structure

- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React component behavior
- **Hook Tests**: Custom hook functionality
- **Integration Tests**: API and caching behavior

### Testing Tools

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **jsdom**: DOM environment for testing

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Setup

1. Set production environment variables
2. Configure caching strategies
3. Optimize API batch sizes for production load
4. Enable appropriate logging levels

### Recommended Production Settings

\`\`\`env
NEXT_PUBLIC_POKEMON_API_BATCH_SIZE=5
NEXT_PUBLIC_POKEMON_API_DELAY_MS=200
NEXT_PUBLIC_CACHE_TTL_MINUTES=120
NEXT_PUBLIC_DEBUG_API_CALLS=false
NEXT_PUBLIC_ENABLE_API_LOGGING=false
\`\`\`

## 🛠️ Development

### Code Style

The project uses:
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better developer experience

### Development Commands

\`\`\`bash
# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Build for production
npm run build
\`\`\`

### Adding New Features

1. **Create Types**: Define TypeScript interfaces in `src/types/`
2. **Add API Functions**: Extend `src/lib/pokemon-cache.ts`
3. **Create Components**: Add UI components in `src/components/`
4. **Write Tests**: Add corresponding test files
5. **Update Documentation**: Update this README if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing comprehensive Pokémon data
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- The Pokémon Company for creating the amazing world of Pokémon

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/pokemon-knowledge-manager/issues) page
2. Create a new issue with detailed information
3. Include environment details and error messages

## 🔄 Changelog

### Version 1.0.0
- Initial release with complete Pokédex functionality
- Advanced search and filtering capabilities
- Responsive design for all devices
- Comprehensive caching system
- Full test coverage

---

**Happy Pokémon hunting! 🎯**
