import { boolean, integer, numeric, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  mark: text("mark").notNull(),
  swatch: text("swatch").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  billNumber: text("bill_number").notNull().unique(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
  grandTotal: numeric("grand_total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoiceItemsTable = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull().references(() => invoicesTable.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => productsTable.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
  unit: text("unit").notNull(),
  rate: numeric("rate", { precision: 12, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
});

export const dailyStockTable = pgTable("daily_stock", {
  id: serial("id").primaryKey(),
  businessDate: text("business_date").notNull(),
  productId: text("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  openingQty: numeric("opening_qty", { precision: 12, scale: 3 }).notNull().default("0"),
  receivedQty: numeric("received_qty", { precision: 12, scale: 3 }).notNull().default("0"),
  soldQty: numeric("sold_qty", { precision: 12, scale: 3 }).notNull().default("0"),
  closingQty: numeric("closing_qty", { precision: 12, scale: 3 }).notNull().default("0"),
}, (table) => [uniqueIndex("daily_stock_date_product").on(table.businessDate, table.productId)]);

export const dailyBalancesTable = pgTable("daily_balances", {
  id: serial("id").primaryKey(),
  businessDate: text("business_date").notNull().unique(),
  openingCash: numeric("opening_cash", { precision: 12, scale: 2 }).notNull().default("0"),
  closingCash: numeric("closing_cash", { precision: 12, scale: 2 }),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
