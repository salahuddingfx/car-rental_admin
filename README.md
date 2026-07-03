# Apex Ride - Admin Panel

<p align="center">
  <strong>Premium Luxury Car Rental Management System - Admin Dashboard</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#security">Security</a> •
  <a href="#license">License</a>
</p>

---

## Overview

Apex Ride Admin Panel is the backend management interface for the Apex Ride premium car rental platform targeting Bangladesh. It enables administrators to manage cars, users, analytics, and platform settings from a unified dashboard.

The admin panel syncs data with the client-side application through shared browser localStorage, providing real-time management capabilities without requiring a separate backend server.

## Features

- **Dashboard Overview** - Real-time stats, recent activities, and platform health metrics
- **Car Management** - Add, edit, delete, and manage car listings with full CRUD operations
- **User Management** - View and manage registered users, roles, and permissions
- **Analytics Dashboard** - Revenue tracking, booking trends, and user engagement metrics
- **Settings Panel** - Platform configuration, notification preferences, and system settings
- **Responsive Design** - Fully responsive sidebar layout that works on all screen sizes
- **Dark Mode Support** - Toggle between light and dark themes with persistent preference
- **Framer Motion Animations** - Smooth transitions and micro-interactions throughout
- **Real-time Data Sync** - Shares state with the client app via localStorage

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI Framework |
| TypeScript | 6.x | Type Safety |
| Vite | 8.x | Build Tool & Dev Server |
| React Router DOM | 7.x | Client-side Routing |
| Zustand | 5.x | State Management |
| TailwindCSS | 3.x | Utility-first CSS |
| Framer Motion | 12.x | Animations |
| Lucide React | 1.x | Icon Library |
| Oxlint | 1.x | Linting |

## Installation

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/salahuddingfx/car-rental_admin.git

# Navigate to admin directory
cd car-rental_admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin panel will be available at `http://localhost:5173` by default.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run lint` | Run Oxlint linter |
| `npm run preview` | Preview production build locally |

## Project Structure

```
admin/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   └── ui/              # Generic UI elements
│   ├── pages/               # Page components
│   │   ├── AdminOverview.tsx
│   │   ├── AdminCars.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AdminAnalytics.tsx
│   │   └── AdminSettings.tsx
│   ├── store/               # Zustand state management
│   │   └── useAdminStore.ts
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── .gitignore
├── .oxlintrc.json           # Oxlint configuration
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── LICENSE                  # MIT License
├── CODE_OF_CONDUCT.md       # Community code of conduct
├── CONTRIBUTING.md          # Contribution guidelines
└── SECURITY.md              # Security policy
```

## Configuration

### Vite Configuration

The project uses Vite with the React plugin and TailwindCSS integration. Path aliases are configured for clean imports:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### TailwindCSS

This project uses TailwindCSS v4 with the `@tailwindcss/vite` plugin for automatic content detection.

### TypeScript

Strict TypeScript configuration with ES2023 target, React JSX transform, and bundler module resolution.

## Data Sync

The admin panel communicates with the client application through shared localStorage keys:

- **Client Data Key**: `car-rental-storage` - Contains cars, users, bookings, and wishlist data
- **Admin Data Key**: `admin-storage` - Contains admin-specific settings and preferences

When admin actions are performed (e.g., deleting a car), the admin panel updates the client's localStorage directly, ensuring both applications stay in sync.

## Browser Support

| Browser | Supported |
|---|---|
| Chrome | Yes |
| Firefox | Yes |
| Safari | Yes |
| Edge | Yes |

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## Security

For reporting security vulnerabilities, please refer to our [Security Policy](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

<a href="https://github.com/salahuddingfx/car-rental_admin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=salahuddingfx/car-rental_admin" />
</a>

### Core Team

| Name | Role | GitHub |
|---|---|---|
| **Salah Uddin Kader** | Creator & Lead Developer | [@salahuddingfx](https://github.com/salahuddingfx) |

Want to contribute? Check out our [Contributing Guide](CONTRIBUTING.md)!

## Author

**Salah Uddin Kader**
- GitHub: [@salahuddingfx](https://github.com/salahuddingfx)
- Portfolio: [salahuddin.codes](https://salahuddin.codes)
- Agency: [Nextora Studio](https://nextora.studio)

---

<p align="center">
  Built with dedication for the premium car rental experience in Bangladesh.
</p>
