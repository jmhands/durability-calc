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
- **Deployment**: Cloudflare Pages

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

## Deployment

The application is configured for deployment to Cloudflare Pages. Follow these steps to deploy:

1. Install Wrangler CLI if not already installed:
   ```bash
   pnpm add -g wrangler
   ```

2. Build the project:
   ```bash
   pnpm build
   ```

3. Deploy to Cloudflare Pages:
   ```bash
   wrangler pages deploy out --project-name durability-calc --branch main
   ```

4. Configure Production Branch (in Cloudflare Dashboard):
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages > durability-calc project
   - Go to Settings > Git Integration
   - Set "Production branch" to "main"

The deployment will be available at:
- Production URL: https://production.durability-calc.pages.dev
- Preview URL: https://[deployment-id].durability-calc.pages.dev

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
