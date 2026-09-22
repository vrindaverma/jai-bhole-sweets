import { Router, type IRouter } from "express";
import { asc, desc, sql } from "drizzle-orm";
import { db, dailyBalancesTable, dailyStockTable, invoiceItemsTable, invoicesTable, productsTable } from "@workspace/db";
import { randomUUID } from "node:crypto";

const router: IRouter = Router();
const businessDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const seedProducts = [
  ["mix-sweet", "Mix Sweet", "Traditional", 340, "kg", "M", "hsl(43 82% 73%)"],
  ["spe-mix-sweet", "Spe. Mix Sweet", "Traditional", 440, "kg", "S", "hsl(45 74% 78%)"],
  ["jalebi", "Jalebi", "Traditional", 180, "kg", "J", "hsl(25 88% 68%)"],
  ["motichur-laddu", "Motichur Laddu", "Ladoo", 180, "kg", "M", "hsl(25 78% 70%)"],
  ["besan-laddu", "Besan Laddu", "Ladoo", 240, "kg", "B", "hsl(37 66% 72%)"],
  ["mawa", "Mawa", "Milk sweets", 380, "kg", "M", "hsl(38 62% 75%)"],
  ["barfi", "Barfi", "Milk sweets", 440, "kg", "B", "hsl(35 72% 71%)"],
  ["milk-cake", "Milk Cake", "Milk sweets", 440, "kg", "M", "hsl(43 82% 73%)"],
  ["peda", "Peda", "Milk sweets", 440, "kg", "P", "hsl(38 62% 75%)"],
  ["gajar-halwa", "Gajar Halwa", "Traditional", 480, "kg", "G", "hsl(25 78% 70%)"],
  ["kaju-barfi", "Kaju Barfi", "Kaju specials", 1100, "kg", "K", "hsl(45 74% 78%)"],
  ["dry-fruit-laddu", "Dry Fruit Laddu", "Kaju specials", 1200, "kg", "D", "hsl(25 78% 70%)"],
  ["paneer", "Paneer", "Milk sweets", 400, "kg", "P", "hsl(43 82% 73%)"],
  ["dahi", "Dahi", "Milk sweets", 120, "kg", "D", "hsl(45 57% 82%)"],
  ["rabdi", "Rabdi", "Milk sweets", 400, "kg", "R", "hsl(38 62% 75%)"],
  ["gulab-jamun", "Gulab Jamun", "Traditional", 15, "piece", "G", "hsl(25 88% 68%)"],
  ["rasmalai", "Rasmalai", "Milk sweets", 30, "piece", "R", "hsl(45 74% 78%)"],
  ["milk", "Milk", "Milk sweets", 80, "litre", "M", "hsl(41 45% 83%)"],
] as const;

async function ensureSeedProducts() {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
  if (count > 0) return;
  await db.insert(productsTable).values(seedProducts.map(([id, name, category, price, unit, mark, swatch]) => ({
    id, name, category, price: String(price), unit, mark, swatch, active: true,
  }))).onConflictDoNothing();
}

router.get("/products", async (_req, res, next) => {
  try {
    await ensureSeedProducts();
    const products = await db.select().from(productsTable).orderBy(asc(productsTable.createdAt));
    res.json(products.map((product) => ({ ...product, price: Number(product.price) })));
  } catch (error) { next(error); }
});

router.post("/products", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const name = String(body.name ?? "").trim();
    const price = Number(body.price);
    if (!name || !Number.isFinite(price) || price <= 0) {
      res.status(400).json({ message: "Valid product name and price are required." }); return;
    }
    const duplicate = await db.execute(sql`select 1 from products where lower(name) = lower(${name}) limit 1`);
    if (duplicate.rows.length) {
      res.status(409).json({ message: `${name} already exists. Select it from the list to update its price.` }); return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sweet";
    const values = {
      id: `${slug}-${randomUUID().slice(0, 8)}`, name, category: String(body.category ?? "Traditional"),
      price: String(price), unit: String(body.unit ?? "kg"),
      mark: String(body.mark ?? name.charAt(0)).slice(0, 2),
      swatch: String(body.swatch ?? "hsl(43 82% 73%)"), active: body.active !== false,
    };
    const [product] = await db.insert(productsTable).values(values).returning();
    res.status(201).json({ ...product, price: Number(product.price) });
  } catch (error) { next(error); }
});

router.put("/products/:id", async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const body = req.body ?? {};
    const values = {
      id, name: String(body.name ?? "").trim(), category: String(body.category ?? "Traditional"),
      price: String(Number(body.price)), unit: String(body.unit ?? "kg"),
      mark: String(body.mark ?? String(body.name ?? "S").charAt(0)).slice(0, 2),
      swatch: String(body.swatch ?? "hsl(43 82% 73%)"), active: body.active !== false, updatedAt: new Date(),
    };
    if (!values.name || !Number.isFinite(Number(values.price)) || Number(values.price) <= 0) {
      res.status(400).json({ message: "Valid product name and price are required." }); return;
    }
    const [product] = await db.insert(productsTable).values(values).onConflictDoUpdate({
      target: productsTable.id, set: values,
    }).returning();
    res.json({ ...product, price: Number(product.price) });
  } catch (error) { next(error); }
});

const nextInvoiceNumber = async (_req: unknown, res: any, next: (error: unknown) => void) => {
  try {
    const result = await db.execute(sql`select greatest(247, coalesce(max(nullif(regexp_replace(bill_number, '[^0-9]', '', 'g'), '')::int), 0)) + 1 as next from invoices`);
    const nextNumber = Number((result.rows[0] as { next?: number } | undefined)?.next ?? 248);
    res.json({ billNumber: `JB-${String(nextNumber).padStart(4, "0")}` });
  } catch (error) { next(error); }
};

router.get("/next-number", nextInvoiceNumber);
router.get("/invoices/next-number", nextInvoiceNumber);

router.put("/draft", async (req, res, next) => {
  try {
    await db.execute(sql`create table if not exists current_bill_drafts (
      draft_key text primary key, payload text not null, updated_at timestamptz not null default now()
    )`);
    await db.execute(sql`insert into current_bill_drafts (draft_key, payload, updated_at)
      values ('main-counter', ${JSON.stringify(req.body ?? {})}, now())
      on conflict (draft_key) do update set payload = excluded.payload, updated_at = now()`);
    res.json({ saved: true });
  } catch (error) { next(error); }
});

router.get("/draft", async (_req, res, next) => {
  try {
    await db.execute(sql`create table if not exists current_bill_drafts (
      draft_key text primary key, payload text not null, updated_at timestamptz not null default now()
    )`);
    const result = await db.execute(sql`select payload, updated_at as "updatedAt" from current_bill_drafts where draft_key = 'main-counter'`);
    const row = result.rows[0] as { payload?: string; updatedAt?: string } | undefined;
    res.json(row ? { ...JSON.parse(row.payload ?? "{}"), updatedAt: row.updatedAt } : null);
  } catch (error) { next(error); }
});

router.delete("/draft", async (_req, res, next) => {
  try {
    await db.execute(sql`delete from current_bill_drafts where draft_key = 'main-counter'`);
    res.json({ deleted: true });
  } catch (error) { next(error); }
});

router.post(["/invoices", "/invoice"], async (req, res, next) => {
  try {
    const { subtotal, discount, grandTotal, paymentMethod, customerName, customerPhone, items } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "At least one item is required." }); return;
    }
    await db.execute(sql`create table if not exists current_bill_drafts (
      draft_key text primary key, payload text not null, updated_at timestamptz not null default now()
    )`);
    const invoice = await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(1998)`);
      const numberResult = await tx.execute(sql`select greatest(247, coalesce(max(nullif(regexp_replace(bill_number, '[^0-9]', '', 'g'), '')::int), 0)) + 1 as next from invoices`);
      const nextNumber = Number((numberResult.rows[0] as { next?: number } | undefined)?.next ?? 248);
      const generatedBillNumber = `JB-${String(nextNumber).padStart(4, "0")}`;
      const [created] = await tx.insert(invoicesTable).values({
        billNumber: generatedBillNumber, subtotal: String(subtotal), discount: String(discount ?? 0),
        grandTotal: String(grandTotal), paymentMethod: String(paymentMethod ?? "Cash"),
        customerName: customerName ? String(customerName) : null,
        customerPhone: customerPhone ? String(customerPhone) : null,
      }).returning();
      await tx.insert(invoiceItemsTable).values(items.map((item: Record<string, unknown>) => ({
        invoiceId: created.id, productId: String(item.productId), productName: String(item.productName),
        quantity: String(item.quantity), unit: String(item.unit), rate: String(item.rate), amount: String(item.amount),
      })));
      for (const item of items as Array<Record<string, unknown>>) {
        const unit = String(item.unit);
        const rawQuantity = Number(item.quantity);
        const sold = unit === "kg" || unit === "g" ? rawQuantity / 1000 : rawQuantity;
        await tx.insert(dailyStockTable).values({
          businessDate: businessDate(), productId: String(item.productId), soldQty: String(sold),
          closingQty: String(-sold),
        }).onConflictDoUpdate({
          target: [dailyStockTable.businessDate, dailyStockTable.productId],
          set: {
            soldQty: sql`${dailyStockTable.soldQty} + ${sold}`,
            closingQty: sql`${dailyStockTable.openingQty} + ${dailyStockTable.receivedQty} - (${dailyStockTable.soldQty} + ${sold})`,
          },
        });
      }
      await tx.execute(sql`delete from current_bill_drafts where draft_key = 'main-counter'`);
      return created;
    });
    res.status(201).json(invoice);
  } catch (error) { next(error); }
});

router.get(["/stock/today", "/stock-today"], async (_req, res, next) => {
  try {
    await ensureSeedProducts();
    const date = businessDate();
    const rows = await db.execute(sql`
      select p.id, p.name, p.unit,
        coalesce(ds.opening_qty, 0)::float as "openingQty",
        coalesce(ds.received_qty, 0)::float as "receivedQty",
        coalesce(ds.sold_qty, 0)::float as "soldQty",
        (coalesce(ds.opening_qty, 0) + coalesce(ds.received_qty, 0) - coalesce(ds.sold_qty, 0))::float as "closingQty"
      from products p left join daily_stock ds on ds.product_id = p.id and ds.business_date = ${date}
      where p.active = true order by p.name
    `);
    res.json({ date, items: rows.rows });
  } catch (error) { next(error); }
});

router.put(["/stock/today/:productId", "/stock-today/:productId"], async (req, res, next) => {
  try {
    const date = businessDate();
    const productId = String(req.params.productId);
    const openingQty = Math.max(0, Number(req.body.openingQty) || 0);
    const receivedQty = Math.max(0, Number(req.body.receivedQty) || 0);
    const [existing] = await db.select({ soldQty: dailyStockTable.soldQty }).from(dailyStockTable)
      .where(sql`${dailyStockTable.businessDate} = ${date} and ${dailyStockTable.productId} = ${productId}`).limit(1);
    const soldQty = Number(existing?.soldQty ?? 0);
    const [saved] = await db.insert(dailyStockTable).values({
      businessDate: date, productId, openingQty: String(openingQty), receivedQty: String(receivedQty),
      soldQty: String(soldQty), closingQty: String(openingQty + receivedQty - soldQty),
    }).onConflictDoUpdate({
      target: [dailyStockTable.businessDate, dailyStockTable.productId],
      set: { openingQty: String(openingQty), receivedQty: String(receivedQty), closingQty: String(openingQty + receivedQty - soldQty) },
    }).returning();
    res.json(saved);
  } catch (error) { next(error); }
});

router.get(["/dashboard/today", "/day-summary"], async (req, res, next) => {
  try {
    const requestedDate = String(req.query.date ?? "");
    const date = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : businessDate();
    const sales = await db.execute(sql`
      select coalesce(sum(grand_total), 0)::float as total,
        coalesce(sum(grand_total) filter (where payment_method = 'Cash'), 0)::float as cash,
        coalesce(sum(grand_total) filter (where payment_method = 'UPI'), 0)::float as upi,
        coalesce(sum(grand_total) filter (where payment_method = 'Card'), 0)::float as card,
        count(*)::int as bills
      from invoices where (created_at at time zone 'Asia/Kolkata')::date = ${date}::date
    `);
    const [balance] = await db.select().from(dailyBalancesTable).where(sql`${dailyBalancesTable.businessDate} = ${date}`).limit(1);
    const itemSales = await db.execute(sql`
      select ii.product_name as "productName", ii.unit,
        sum(ii.quantity)::float as quantity, sum(ii.amount)::float as amount,
        count(distinct i.id)::int as "billCount"
      from invoice_items ii join invoices i on i.id = ii.invoice_id
      where (i.created_at at time zone 'Asia/Kolkata')::date = ${date}::date
      group by ii.product_name, ii.unit order by sum(ii.amount) desc
    `);
    const bills = await db.execute(sql`
      select i.bill_number as "billNumber", i.created_at as "createdAt", i.payment_method as "paymentMethod",
        i.customer_name as "customerName", i.customer_phone as "customerPhone", i.subtotal::float,
        i.discount::float, i.grand_total::float as "grandTotal",
        coalesce(json_agg(json_build_object(
          'productName', ii.product_name, 'quantity', ii.quantity::float, 'unit', ii.unit,
          'rate', ii.rate::float, 'amount', ii.amount::float
        ) order by ii.id) filter (where ii.id is not null), '[]'::json) as items
      from invoices i left join invoice_items ii on ii.invoice_id = i.id
      where (i.created_at at time zone 'Asia/Kolkata')::date = ${date}::date
      group by i.id order by i.id
    `);
    const hourlySales = await db.execute(sql`
      select to_char(date_trunc('hour', created_at at time zone 'Asia/Kolkata'), 'HH24:00') as hour,
        count(*)::int as bills, sum(grand_total)::float as amount
      from invoices
      where (created_at at time zone 'Asia/Kolkata')::date = ${date}::date
      group by date_trunc('hour', created_at at time zone 'Asia/Kolkata')
      order by date_trunc('hour', created_at at time zone 'Asia/Kolkata')
    `);
    const stock = await db.execute(sql`
      select p.name as "productName", p.unit, p.price::float as price,
        coalesce(ds.opening_qty, 0)::float as "openingQty",
        coalesce(ds.received_qty, 0)::float as "receivedQty",
        coalesce(ds.sold_qty, 0)::float as "soldQty",
        (coalesce(ds.opening_qty, 0) + coalesce(ds.received_qty, 0) - coalesce(ds.sold_qty, 0))::float as "closingQty",
        ((coalesce(ds.opening_qty, 0) + coalesce(ds.received_qty, 0) - coalesce(ds.sold_qty, 0)) * p.price)::float as "closingValue"
      from products p left join daily_stock ds on ds.product_id = p.id and ds.business_date = ${date}
      where p.active = true order by p.name
    `);
    res.json({ date, ...(sales.rows[0] ?? {}), itemSales: itemSales.rows, invoices: bills.rows,
      hourlySales: hourlySales.rows, stock: stock.rows,
      openingCash: Number(balance?.openingCash ?? 0), closingCash: balance?.closingCash == null ? null : Number(balance.closingCash), notes: balance?.notes ?? "" });
  } catch (error) { next(error); }
});

router.put(["/dashboard/today/balance", "/day-balance"], async (req, res, next) => {
  try {
    const requestedDate = String(req.body.date ?? "");
    const date = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : businessDate();
    const openingCash = Math.max(0, Number(req.body.openingCash) || 0);
    const closingCash = req.body.closingCash === "" || req.body.closingCash == null ? null : Math.max(0, Number(req.body.closingCash) || 0);
    const notes = String(req.body.notes ?? "").slice(0, 500);
    const [saved] = await db.insert(dailyBalancesTable).values({
      businessDate: date, openingCash: String(openingCash), closingCash: closingCash == null ? null : String(closingCash), notes,
    }).onConflictDoUpdate({ target: dailyBalancesTable.businessDate, set: {
      openingCash: String(openingCash), closingCash: closingCash == null ? null : String(closingCash), notes, updatedAt: new Date(),
    }}).returning();
    res.json(saved);
  } catch (error) { next(error); }
});

export default router;
