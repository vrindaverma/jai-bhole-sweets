# Jai Bhole Sweets POS — shop setup

## One-time database setup on Replit

1. Open the Replit project and add/provision a PostgreSQL database.
2. Confirm that Replit has created the secret named `DATABASE_URL`.
3. In Shell, run:

   ```bash
   pnpm install
   pnpm --filter @workspace/db run push
   ```

4. Restart the Repl.

The database stores products, invoices, invoice line items, daily product stock,
opening cash and closing cash. Daily sales and Cash/UPI/Card totals are calculated
from saved invoices.

## Daily shop workflow

1. Open **Daily stock** in the morning and enter opening quantity and new stock received.
2. Create bills normally and always press **Save bill**. Sold quantities update automatically.
3. Open **Day summary** at night to see total sales and payment split.
4. Enter counted closing cash and save the day balance.

For weighted products, daily stock is entered in kilograms. Piece-based products
use pieces and milk uses litres.
