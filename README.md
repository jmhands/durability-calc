# Durability Calculator

A modern web application for calculating storage system durability across different RAID configurations and erasure coding schemes. Built with Next.js, React, and Tailwind CSS.

## Features

- Calculate storage durability for various configurations:
  - RAID 1 (Mirroring)
  - RAID 5 (Single Parity)
  - RAID 6 (Double Parity)
  - RAID 10 (Striped Mirrors)
  - Erasure Coding
- Configurable parameters:
  - Number of data shards
  - Number of parity shards
  - Annual Failure Rate (AFR)
  - Rebuild time
- Real-time calculations
- Modern, responsive UI with dark mode support

## Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Charts**: Recharts
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/durability-calc.git
   cd durability-calc
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
durability-calc/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and calculations
├── public/             # Static assets
└── styles/             # Global styles
```

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.
