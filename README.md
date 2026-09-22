# Jai Bhole Sweets POS

Production-ready point-of-sale and daily shop management system for **Jai Bhole Sweets — Since 1998**, Bisauli, Badaun.

## Features

- Professional billing and 80 mm receipt printing
- Cash, UPI and card payment split
- Product and price management
- Daily opening, received, sold and closing stock
- Date-wise sales history and bill drill-down
- Detailed Excel reports with bill-wise item and quantity rows
- PostgreSQL-backed products, invoices, stock and balances
- Responsive counter interface for desktop and mobile

## Tech stack

- React + TypeScript + Vite
- Express + TypeScript
- PostgreSQL + Drizzle ORM
- Vercel Functions

## Local setup

1. Install dependencies with `pnpm install`.
2. Set `DATABASE_URL` to a PostgreSQL connection string.
3. Run the API and frontend development scripts from their workspace packages.

See [SHOP_SETUP.md](SHOP_SETUP.md) for shop deployment notes.

## Live application

[jai-bhole-sweets-v9.vercel.app](https://jai-bhole-sweets-v9.vercel.app)

> Database credentials and environment files are intentionally excluded from this repository.
