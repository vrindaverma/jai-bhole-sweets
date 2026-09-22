import { Fragment, type CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  BarChart3,
  Boxes,
  Check,
  CreditCard,
  Download,
  Edit3,
  Minus,
  Plus,
  Printer,
  ReceiptText,
  Search,
  Settings2,
  ShoppingBag,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react';

import receiptLogo from '@assets/jai-bhole-logo.svg';

type Category = 'All' | 'Milk sweets' | 'Kaju specials' | 'Ladoo' | 'Traditional';
type ProductCategory = Exclude<Category, 'All'>;
type Unit = 'kg' | 'g' | 'piece' | 'litre';
type PaymentMethod = 'Cash' | 'UPI' | 'Card';

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: Unit;
  mark: string;
  swatch: string;
  active: boolean;
};

type CartItem = Product & {
  quantity: number;
};

type PrintableBill = {
  billNumber: string;
  customerName: string;
  customerPhone: string;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  payment: PaymentMethod;
  printedAt: Date;
};

const initialProducts: Product[] = [
  { id: 'mix-sweet', name: 'Mix Sweet', category: 'Traditional', price: 340, unit: 'kg', mark: 'M', swatch: 'hsl(43 82% 73%)', active: true },
  { id: 'spe-mix-sweet', name: 'Spe. Mix Sweet', category: 'Traditional', price: 440, unit: 'kg', mark: 'S', swatch: 'hsl(45 74% 78%)', active: true },
  { id: 'jalebi', name: 'Jalebi', category: 'Traditional', price: 180, unit: 'kg', mark: 'J', swatch: 'hsl(25 88% 68%)', active: true },
  { id: 'motichur-laddu', name: 'Motichur Laddu', category: 'Ladoo', price: 180, unit: 'kg', mark: 'M', swatch: 'hsl(25 78% 70%)', active: true },
  { id: 'besan-laddu', name: 'Besan Laddu', category: 'Ladoo', price: 240, unit: 'kg', mark: 'B', swatch: 'hsl(37 66% 72%)', active: true },
  { id: 'mawa', name: 'Mawa', category: 'Milk sweets', price: 380, unit: 'kg', mark: 'M', swatch: 'hsl(38 62% 75%)', active: true },
  { id: 'barfi', name: 'Barfi', category: 'Milk sweets', price: 440, unit: 'kg', mark: 'B', swatch: 'hsl(35 72% 71%)', active: true },
  { id: 'milk-log', name: 'Milk Log', category: 'Milk sweets', price: 440, unit: 'kg', mark: 'M', swatch: 'hsl(45 57% 82%)', active: true },
  { id: 'milk-cake', name: 'Milk Cake', category: 'Milk sweets', price: 440, unit: 'kg', mark: 'M', swatch: 'hsl(43 82% 73%)', active: true },
  { id: 'peda', name: 'Peda', category: 'Milk sweets', price: 440, unit: 'kg', mark: 'P', swatch: 'hsl(38 62% 75%)', active: true },
  { id: 'cream-bengali', name: 'Cream Bengali', category: 'Milk sweets', price: 440, unit: 'kg', mark: 'C', swatch: 'hsl(41 45% 83%)', active: true },
  { id: 'gajar-halwa', name: 'Gajar Halwa', category: 'Traditional', price: 480, unit: 'kg', mark: 'G', swatch: 'hsl(25 78% 70%)', active: true },
  { id: 'ghee-sonpapdi', name: 'Ghee Sonpapdi', category: 'Traditional', price: 480, unit: 'kg', mark: 'G', swatch: 'hsl(45 57% 82%)', active: true },
  { id: 'veg-sonpapdi', name: 'Veg. Sonpapdi', category: 'Traditional', price: 340, unit: 'kg', mark: 'V', swatch: 'hsl(30 54% 77%)', active: true },
  { id: 'white-rasgulla', name: 'White Rasgulla', category: 'Milk sweets', price: 340, unit: 'kg', mark: 'W', swatch: 'hsl(41 45% 83%)', active: true },
  { id: 'black-rasgulla', name: 'Black Rasgulla', category: 'Milk sweets', price: 340, unit: 'kg', mark: 'B', swatch: 'hsl(35 72% 71%)', active: true },
  { id: 'paan-gelori', name: 'Paan Gelori', category: 'Traditional', price: 600, unit: 'kg', mark: 'P', swatch: 'hsl(37 66% 72%)', active: true },
  { id: 'doda-barfi', name: 'Doda Barfi', category: 'Kaju specials', price: 660, unit: 'kg', mark: 'D', swatch: 'hsl(30 54% 77%)', active: true },
  { id: 'kaju-barfi', name: 'Kaju Barfi', category: 'Kaju specials', price: 1100, unit: 'kg', mark: 'K', swatch: 'hsl(45 74% 78%)', active: true },
  { id: 'dry-fruit-laddu', name: 'Dry Fruit Laddu', category: 'Kaju specials', price: 1200, unit: 'kg', mark: 'D', swatch: 'hsl(25 78% 70%)', active: true },
  { id: 'paneer', name: 'Paneer', category: 'Milk sweets', price: 400, unit: 'kg', mark: 'P', swatch: 'hsl(43 82% 73%)', active: true },
  { id: 'dahi', name: 'Dahi', category: 'Milk sweets', price: 120, unit: 'kg', mark: 'D', swatch: 'hsl(45 57% 82%)', active: true },
  { id: 'rabdi', name: 'Rabdi', category: 'Milk sweets', price: 400, unit: 'kg', mark: 'R', swatch: 'hsl(38 62% 75%)', active: true },
  { id: 'sponge-rasgulla', name: 'Sponge Rasgulla', category: 'Milk sweets', price: 20, unit: 'piece', mark: 'S', swatch: 'hsl(41 45% 83%)', active: true },
  { id: 'gulab-jamun', name: 'Gulab Jamun', category: 'Traditional', price: 15, unit: 'piece', mark: 'G', swatch: 'hsl(25 88% 68%)', active: true },
  { id: 'rasmalai', name: 'Rasmalai', category: 'Milk sweets', price: 30, unit: 'piece', mark: 'R', swatch: 'hsl(45 74% 78%)', active: true },
  { id: 'milk', name: 'Milk', category: 'Milk sweets', price: 80, unit: 'litre', mark: 'M', swatch: 'hsl(41 45% 83%)', active: true },
];

const categories: Category[] = ['All', 'Milk sweets', 'Kaju specials', 'Ladoo', 'Traditional'];
const productCategories: ProductCategory[] = categories.filter((item): item is ProductCategory => item !== 'All');
const swatches = ['hsl(43 82% 73%)', 'hsl(25 78% 70%)', 'hsl(37 66% 72%)', 'hsl(45 57% 82%)'];
const currency = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

function money(value: number) {
  return `₹${currency.format(Math.max(0, value))}`;
}

function isWeightUnit(unit: Unit) {
  return unit === 'kg' || unit === 'g';
}

function isVolumeUnit(unit: Unit) {
  return unit === 'litre';
}

function itemPrice(item: CartItem) {
  return isWeightUnit(item.unit) ? item.price * item.quantity / 1000 : item.price * item.quantity;
}

function formatVolumeQuantity(quantity: number) {
  const millilitres = Math.round(quantity * 1000);
  if (millilitres < 1000) return `${millilitres} ml`;
  const litres = Number((millilitres / 1000).toFixed(3));
  return `${litres} litre${litres === 1 ? '' : 's'}`;
}

function quantityLabel(item: CartItem) {
  if (item.unit === 'piece') return `${item.quantity} pc`;
  if (isVolumeUnit(item.unit)) return formatVolumeQuantity(item.quantity);
  return `${item.quantity >= 1000 ? `${item.quantity / 1000} kg` : `${item.quantity} g`}`;
}

function priceUnitLabel(unit: Unit) {
  if (isWeightUnit(unit)) return 'kg';
  if (isVolumeUnit(unit)) return 'litre';
  return 'pc';
}

function productTypeLabel(unit: Unit) {
  if (isWeightUnit(unit)) return 'Weight';
  if (isVolumeUnit(unit)) return 'Volume';
  return 'Pieces';
}

function priceBasisLabel(unit: Unit) {
  if (isWeightUnit(unit)) return 'Per kilogram';
  if (isVolumeUnit(unit)) return 'Per litre';
  return 'Per piece';
}

type ProductDraft = {
  name: string;
  price: string;
  category: ProductCategory;
  unit: Unit;
  active: boolean;
};

type StockRow = { id: string; name: string; unit: Unit; openingQty: number; receivedQty: number; soldQty: number; closingQty: number };
type DaySummary = {
  date: string; total: number; cash: number; upi: number; card: number; bills: number;
  openingCash: number; closingCash: number | null; notes: string;
  itemSales: Array<{ productName: string; unit: Unit; quantity: number; amount: number; billCount: number }>;
  hourlySales: Array<{ hour: string; bills: number; amount: number }>;
  stock: Array<{ productName: string; unit: Unit; price: number; openingQty: number; receivedQty: number; soldQty: number; closingQty: number; closingValue: number }>;
  invoices: Array<{
    billNumber: string; createdAt: string; paymentMethod: PaymentMethod; customerName: string | null; customerPhone: string | null;
    subtotal: number; discount: number; grandTotal: number;
    items: Array<{ productName: string; quantity: number; unit: Unit; rate: number; amount: number }>;
  }>;
};

function currentBusinessDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function createProductDraft(): ProductDraft {
  return {
    name: '',
    price: '',
    category: 'Traditional',
    unit: 'kg',
    active: true,
  };
}

function draftFromProduct(product: Product): ProductDraft {
  return {
    name: product.name,
    price: String(product.price),
    category: product.category,
    unit: product.unit,
    active: product.active,
  };
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>('Cash');
  const [billSequence, setBillSequence] = useState(248);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [now, setNow] = useState(new Date());
  const [feedback, setFeedback] = useState('');
  const [lastAdded, setLastAdded] = useState('');
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft>(() => createProductDraft());
  const [stockRows, setStockRows] = useState<StockRow[]>([]);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [summary, setSummary] = useState<DaySummary | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [summaryDate, setSummaryDate] = useState(currentBusinessDate);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'ready' | 'saving' | 'saved'>('ready');
  const [isProductSaving, setIsProductSaving] = useState(false);
  const [printBillData, setPrintBillData] = useState<PrintableBill | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const modalOpen = isProductManagerOpen || isStockOpen || isSummaryOpen;
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, [isProductManagerOpen, isStockOpen, isSummaryOpen]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((response) => {
        if (!response.ok) throw new Error('Products could not be loaded');
        return response.json() as Promise<Product[]>;
      }),
      fetch('/api/next-number').then((response) => {
        if (!response.ok) throw new Error('Bill number could not be loaded');
        return response.json() as Promise<{ billNumber: string }>;
      }),
      fetch('/api/draft').then((response) => response.ok ? response.json() : null),
    ]).then(([savedProducts, nextBill, draft]) => {
      setProducts(savedProducts);
      setBillSequence(Number(nextBill.billNumber.split('-')[1]) || 248);
      if (draft?.cart?.length) {
        setCart(draft.cart); setDiscount(Number(draft.discount) || 0);
        setPayment(draft.payment || 'Cash'); setCustomerName(draft.customerName || ''); setCustomerPhone(draft.customerPhone || '');
        showFeedback('Previous unfinished bill restored automatically.');
      }
      setDraftReady(true);
    }).catch(() => { setDraftReady(true); showFeedback('Database is unavailable. Showing the built-in catalog.'); });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!product.active) return false;
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery = !normalized || `${product.name} ${product.category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  const subtotal = useMemo(() => cart.reduce((total, item) => total + itemPrice(item), 0), [cart]);
  const appliedDiscount = Math.min(Math.max(0, discount), subtotal);
  const grandTotal = Math.max(0, subtotal - appliedDiscount);
  const billNumber = `JB-${String(billSequence).padStart(4, '0')}`;

  useEffect(() => {
    if (!draftReady) return;
    const timeout = window.setTimeout(async () => {
      setDraftStatus('saving');
      try {
        const response = await fetch('/api/draft', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart, discount: appliedDiscount, payment, customerName, customerPhone }),
        });
        if (!response.ok) throw new Error();
        setDraftStatus('saved');
      } catch { setDraftStatus('ready'); }
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [appliedDiscount, cart, customerName, customerPhone, draftReady, payment]);

  const showFeedback = (message: string) => setFeedback(message);

  const openProductManager = () => {
    const firstProduct = products[0];
    setEditingProductId(firstProduct?.id ?? null);
    setProductDraft(firstProduct ? draftFromProduct(firstProduct) : createProductDraft());
    setIsProductManagerOpen(true);
  };

  const selectProductForEdit = (product: Product) => {
    setEditingProductId(product.id);
    setProductDraft(draftFromProduct(product));
  };

  const startNewProduct = () => {
    setEditingProductId(null);
    setProductDraft(createProductDraft());
  };

  const saveProduct = async () => {
    const name = productDraft.name.trim();
    const price = Number(productDraft.price);
    if (!name) {
      showFeedback('Enter a product name before saving.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      showFeedback('Enter a selling price greater than ₹0.');
      return;
    }

    const existingProduct = editingProductId ? products.find((product) => product.id === editingProductId) : null;
    if (existingProduct && existingProduct.name !== name && !window.confirm(`Rename ${existingProduct.name} to ${name}?\n\nTo keep ${existingProduct.name} and create another item, press Cancel and use “Add new product”.`)) {
      return;
    }

    const savedProduct: Product = {
      id: editingProductId ?? `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sweet'}-${Date.now()}`,
      name,
      category: productDraft.category,
      price,
      unit: productDraft.unit,
      mark: name.charAt(0).toUpperCase(),
      swatch: editingProductId
        ? products.find((product) => product.id === editingProductId)?.swatch ?? swatches[products.length % swatches.length]
        : swatches[products.length % swatches.length],
      active: productDraft.active,
    };

    setIsProductSaving(true);
    try {
      const response = await fetch(editingProductId ? `/api/products/${encodeURIComponent(savedProduct.id)}` : '/api/products', {
        method: editingProductId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(savedProduct),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'Product could not be saved');
      const persisted = await response.json() as Product;
      setProducts((current) => editingProductId
        ? current.map((product) => product.id === editingProductId ? persisted : product)
        : [...current, persisted]);
      setEditingProductId(persisted.id);
      setProductDraft(draftFromProduct(persisted));
      showFeedback(editingProductId ? `${persisted.name} updated in the database.` : `${persisted.name} added to the database.`);
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : 'Could not save the product. Please retry.');
    } finally { setIsProductSaving(false); }
  };

  const toggleProductActive = async (product: Product) => {
    const updated = { ...product, active: !product.active };
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error();
      setProducts((current) => current.map((item) => item.id === product.id ? updated : item));
      if (editingProductId === product.id) setProductDraft((current) => ({ ...current, active: updated.active }));
      showFeedback(updated.active ? `${product.name} is active for billing.` : `${product.name} hidden from billing.`);
    } catch { showFeedback('Could not update the product in the database.'); }
  };

  const addProduct = (product: Product) => {
    setLastAdded(product.id);
    window.setTimeout(() => setLastAdded(''), 400);
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (isWeightUnit(item.unit) ? 250 : 1) }
            : item,
        );
      }
      return [...current, { ...product, quantity: isWeightUnit(product.unit) ? 250 : 1 }];
    });
  };

  const changeQuantity = (id: string, direction: number) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;
          const step = isWeightUnit(item.unit) ? 50 : isVolumeUnit(item.unit) ? 0.25 : 1;
          return { ...item, quantity: item.quantity + direction * step };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const setQuantity = (id: string, rawValue: string) => {
    const next = Number(rawValue);
    if (!Number.isFinite(next)) return;
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;
          const normalized = isVolumeUnit(item.unit) ? Math.round(next * 1000) / 1000 : Math.round(next);
          return { ...item, quantity: Math.max(0, normalized) };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const clearBill = () => {
    if (!cart.length && !discount) {
      showFeedback('The bill is already clear.');
      return;
    }
    if (window.confirm('Clear all items from this bill?')) {
      setCart([]);
      setDiscount(0);
      setPayment('Cash');
      showFeedback('Current bill cleared.');
    }
  };

  const completeBill = async (clearAfter = true) => {
    if (!cart.length) {
      showFeedback('Add at least one sweet before completing the bill.');
      return null;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/invoice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtotal, discount: appliedDiscount, grandTotal, paymentMethod: payment,
          customerName: customerName.trim() || null, customerPhone: customerPhone.trim() || null,
          items: cart.map((item) => ({
            productId: item.id, productName: item.name, quantity: item.quantity,
            unit: item.unit, rate: item.price, amount: itemPrice(item),
          })),
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      const saved = await response.json() as { billNumber: string };
      setBillSequence(Number(saved.billNumber.split('-')[1]) + 1);
      if (clearAfter) {
        setCart([]); setDiscount(0); setPayment('Cash'); setCustomerName(''); setCustomerPhone('');
      }
      showFeedback(`Bill ${saved.billNumber} completed and added to today’s sales.`);
      return saved.billNumber;
    } catch { showFeedback('Bill could not be completed. Please retry once.'); return null; }
    finally { setIsSaving(false); }
  };

  const printBill = async () => {
    if (!cart.length) {
      showFeedback('Add at least one sweet before printing.');
      return;
    }
    const savedNumber = await completeBill(false);
    if (!savedNumber) return;
    setPrintBillData({
      billNumber: savedNumber,
      customerName,
      customerPhone,
      cart: cart.map((item) => ({ ...item })),
      subtotal,
      discount: appliedDiscount,
      grandTotal,
      payment,
      printedAt: new Date(),
    });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    let cleaned = false;
    const finishPrinting = () => {
      if (cleaned) return;
      cleaned = true;
      setCart([]); setDiscount(0); setPayment('Cash'); setCustomerName(''); setCustomerPhone('');
      setPrintBillData(null);
    };
    window.addEventListener('afterprint', finishPrinting, { once: true });
    window.print();
    window.setTimeout(finishPrinting, 30_000);
  };

  const printable = printBillData ?? {
    billNumber, customerName, customerPhone, cart, subtotal, discount: appliedDiscount,
    grandTotal, payment, printedAt: now,
  };

  const downloadDayReport = async () => {
    if (!summary) return;
    const XLSX = await import('xlsx-js-style');
    const workbook = XLSX.utils.book_new();
    const maroon = '8C2F1B';
    const saffron = 'D94F1E';
    const gold = 'E5B949';
    const cream = 'FFF8EC';
    const pale = 'F8EBDD';
    const dark = '3A2118';
    const moneyFormat = '₹#,##0.00';
    const thinBorder = { style: 'thin', color: { rgb: 'DECDBD' } };
    const titleStyle = { font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 16 }, fill: { fgColor: { rgb: maroon } }, alignment: { horizontal: 'center', vertical: 'center' } };
    const headerStyle = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: saffron } }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder } };
    const totalStyle = { font: { bold: true, color: { rgb: dark } }, fill: { fgColor: { rgb: 'FBE6B0' } }, border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder } };
    const cellStyle = { border: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder }, alignment: { vertical: 'center' } };
    const applyRowStyle = (sheet: any, row: number, fromColumn: number, toColumn: number, style: any) => {
      for (let column = fromColumn; column <= toColumn; column += 1) {
        const address = XLSX.utils.encode_cell({ r: row - 1, c: column - 1 });
        if (!sheet[address]) sheet[address] = { t: 's', v: '' };
        sheet[address].s = style;
      }
    };
    const decorateTable = (sheet: any, headerRow: number, lastRow: number, lastColumn: number) => {
      applyRowStyle(sheet, headerRow, 1, lastColumn, headerStyle);
      for (let row = headerRow + 1; row <= lastRow; row += 1) applyRowStyle(sheet, row, 1, lastColumn, cellStyle);
      sheet['!autofilter'] = { ref: `${XLSX.utils.encode_col(0)}${headerRow}:${XLSX.utils.encode_col(lastColumn - 1)}${Math.max(headerRow, lastRow)}` };
    };
    const paymentTotal = Math.max(summary.total, 1);
    const bar = (value: number) => `${'█'.repeat(Math.round((value / paymentTotal) * 20))}${'░'.repeat(20 - Math.round((value / paymentTotal) * 20))}`;
    const bestProduct = summary.itemSales[0];
    const busiestHour = [...summary.hourlySales].sort((a, b) => b.amount - a.amount)[0];

    const dashboardRows: Array<Array<string | number>> = [
      ['JAI BHOLE SWEETS — DAILY BUSINESS DASHBOARD', '', '', ''],
      ['Since 1998 · In front of Old Water Tank, Main Road, Bisauli, Badaun – 243720', '', '', ''],
      ['Phone', '7983967977', 'Business Date', summary.date],
      [],
      ['KPI', 'Value', 'KPI', 'Value'],
      ['Total Sales', summary.total, 'Total Bills', summary.bills],
      ['Average Bill Value', summary.bills ? summary.total / summary.bills : 0, 'Total Discount', summary.invoices.reduce((total, invoice) => total + invoice.discount, 0)],
      ['Best-Selling Product', bestProduct?.productName ?? 'No sales', 'Busiest Hour', busiestHour?.hour ?? 'No sales'],
      ['Products Sold', summary.itemSales.length, 'Total Units/Weight Lines', summary.itemSales.reduce((total, item) => total + item.quantity, 0)],
      [],
      ['PAYMENT MIX', 'Amount', 'Share', 'Visual'],
      ['Cash', summary.cash, summary.total ? summary.cash / summary.total : 0, bar(summary.cash)],
      ['UPI', summary.upi, summary.total ? summary.upi / summary.total : 0, bar(summary.upi)],
      ['Card', summary.card, summary.total ? summary.card / summary.total : 0, bar(summary.card)],
      ['TOTAL', summary.total, 1, bar(summary.total)],
      [],
      ['CASH CLOSING', 'Amount', '', ''],
      ['Opening Cash', summary.openingCash, '', ''],
      ['Cash Sales', summary.cash, '', ''],
      ['Expected Closing Cash', summary.openingCash + summary.cash, '', ''],
      ['Closing Cash Counted', summary.closingCash ?? 'Not entered', '', ''],
      ['Shortage / Excess', summary.closingCash == null ? 'Not entered' : summary.closingCash - (summary.openingCash + summary.cash), '', ''],
      ['Closing Notes', summary.notes || '—', '', ''],
    ];
    const dashboard = XLSX.utils.aoa_to_sheet(dashboardRows);
    dashboard['!merges'] = [XLSX.utils.decode_range('A1:D1'), XLSX.utils.decode_range('A2:D2')];
    dashboard['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 24 }, { wch: 28 }];
    dashboard['!rows'] = [{ hpt: 28 }, { hpt: 22 }];
    applyRowStyle(dashboard, 1, 1, 4, titleStyle);
    applyRowStyle(dashboard, 2, 1, 4, { font: { italic: true, color: { rgb: dark } }, fill: { fgColor: { rgb: cream } }, alignment: { horizontal: 'center' } });
    [5, 11, 17].forEach((row) => applyRowStyle(dashboard, row, 1, 4, headerStyle));
    applyRowStyle(dashboard, 15, 1, 4, totalStyle);
    ['B6', 'B7', 'B12', 'B13', 'B14', 'B15', 'B18', 'B19', 'B20', 'B21', 'B22'].forEach((address) => { if (dashboard[address] && typeof dashboard[address].v === 'number') dashboard[address].z = moneyFormat; });
    ['C12', 'C13', 'C14', 'C15'].forEach((address) => { if (dashboard[address]) dashboard[address].z = '0.0%'; });
    XLSX.utils.book_append_sheet(workbook, dashboard, 'Dashboard');

    const registerRows: Array<Array<string | number>> = [
      ['BILL REGISTER', '', '', '', '', '', '', '', ''],
      ['Bill Number', 'Date', 'Time', 'Customer', 'Mobile', 'Payment', 'Subtotal', 'Discount', 'Final Total'],
      ...summary.invoices.map((invoice) => {
        const created = new Date(invoice.createdAt);
        return [invoice.billNumber, created.toLocaleDateString('en-IN'), created.toLocaleTimeString('en-IN'), invoice.customerName || 'Walk-in', invoice.customerPhone || '—', invoice.paymentMethod, invoice.subtotal, invoice.discount, invoice.grandTotal];
      }),
      ['TOTAL', '', '', '', '', '', summary.invoices.reduce((total, invoice) => total + invoice.subtotal, 0), summary.invoices.reduce((total, invoice) => total + invoice.discount, 0), summary.total],
    ];
    const register = XLSX.utils.aoa_to_sheet(registerRows);
    register['!merges'] = [XLSX.utils.decode_range('A1:I1')];
    register['!cols'] = [{ wch: 14 }, { wch: 13 }, { wch: 15 }, { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 16 }];
    applyRowStyle(register, 1, 1, 9, titleStyle); decorateTable(register, 2, registerRows.length, 9); applyRowStyle(register, registerRows.length, 1, 9, totalStyle);
    for (let row = 3; row <= registerRows.length; row += 1) ['G', 'H', 'I'].forEach((column) => { if (register[`${column}${row}`]) register[`${column}${row}`].z = moneyFormat; });
    XLSX.utils.book_append_sheet(workbook, register, 'Bill Register');

    const billRows: Array<Array<string | number>> = [
      ['BILL ITEMS — item rows are visible below each bill; use Excel outline + / − to collapse or expand', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Bill Number', 'Date', 'Time', 'Customer', 'Mobile', 'Payment', 'Ordered Item', 'Quantity', 'Unit', 'Rate', 'Item Amount', 'Subtotal', 'Discount', 'Bill Total'],
    ];
    const billRowMeta: Array<{ level?: number; hidden?: boolean; collapsed?: boolean }> = [{ hpt: 28 } as any, {}];
    summary.invoices.forEach((invoice) => {
      const created = new Date(invoice.createdAt);
      billRows.push([invoice.billNumber, created.toLocaleDateString('en-IN'), created.toLocaleTimeString('en-IN'), invoice.customerName || 'Walk-in', invoice.customerPhone || '—', invoice.paymentMethod, `${invoice.items.length} item${invoice.items.length === 1 ? '' : 's'} — shown below`, '', '', '', '', invoice.subtotal, invoice.discount, invoice.grandTotal]);
      billRowMeta.push({ collapsed: false });
      invoice.items.forEach((item) => {
        billRows.push([invoice.billNumber, '', '', '', '', '', `↳ ${item.productName}`, item.quantity, item.unit, item.rate, item.amount, '', '', '']);
        billRowMeta.push({ level: 1, hidden: false });
      });
    });
    const billsSheet = XLSX.utils.aoa_to_sheet(billRows);
    billsSheet['!merges'] = [XLSX.utils.decode_range('A1:N1')];
    billsSheet['!cols'] = [{ wch: 14 }, { wch: 13 }, { wch: 15 }, { wch: 20 }, { wch: 16 }, { wch: 12 }, { wch: 28 }, { wch: 13 }, { wch: 11 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 16 }];
    billsSheet['!rows'] = billRowMeta; billsSheet['!outline'] = { above: false, left: false };
    applyRowStyle(billsSheet, 1, 1, 14, titleStyle); decorateTable(billsSheet, 2, billRows.length, 14);
    for (let row = 3; row <= billRows.length; row += 1) ['J', 'K', 'L', 'M', 'N'].forEach((column) => { if (billsSheet[`${column}${row}`] && typeof billsSheet[`${column}${row}`].v === 'number') billsSheet[`${column}${row}`].z = moneyFormat; });
    XLSX.utils.book_append_sheet(workbook, billsSheet, 'Bills (Expandable)');

    const productRows: Array<Array<string | number>> = [['PRODUCT PERFORMANCE', '', '', '', '', '', ''], ['Rank', 'Product', 'Quantity Sold', 'Unit', 'Bills Containing Item', 'Revenue', 'Revenue Share'], ...summary.itemSales.map((item, index) => [index + 1, item.productName, item.quantity, item.unit, item.billCount, item.amount, summary.total ? item.amount / summary.total : 0]), ['TOTAL', '', summary.itemSales.reduce((total, item) => total + item.quantity, 0), '', '', summary.total, 1]];
    const productSheet = XLSX.utils.aoa_to_sheet(productRows);
    productSheet['!merges'] = [XLSX.utils.decode_range('A1:G1')]; productSheet['!cols'] = [{ wch: 8 }, { wch: 26 }, { wch: 16 }, { wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 16 }];
    applyRowStyle(productSheet, 1, 1, 7, titleStyle); decorateTable(productSheet, 2, productRows.length, 7); applyRowStyle(productSheet, productRows.length, 1, 7, totalStyle);
    for (let row = 3; row <= productRows.length; row += 1) { if (productSheet[`F${row}`]) productSheet[`F${row}`].z = moneyFormat; if (productSheet[`G${row}`]) productSheet[`G${row}`].z = '0.0%'; }
    XLSX.utils.book_append_sheet(workbook, productSheet, 'Product Sales');

    const stockRows = [['STOCK REPORT', '', '', '', '', '', '', ''], ['Product', 'Unit', 'Rate', 'Opening', 'New Stock', 'Sold', 'Remaining', 'Closing Stock Value'], ...summary.stock.map((item) => [item.productName, item.unit, item.price, item.openingQty, item.receivedQty, item.soldQty, item.closingQty, item.closingValue]), ['TOTAL VALUE', '', '', '', '', '', '', summary.stock.reduce((total, item) => total + item.closingValue, 0)]];
    const stockSheet = XLSX.utils.aoa_to_sheet(stockRows);
    stockSheet['!merges'] = [XLSX.utils.decode_range('A1:H1')]; stockSheet['!cols'] = [{ wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 21 }];
    applyRowStyle(stockSheet, 1, 1, 8, titleStyle); decorateTable(stockSheet, 2, stockRows.length, 8); applyRowStyle(stockSheet, stockRows.length, 1, 8, totalStyle);
    for (let row = 3; row <= stockRows.length; row += 1) { if (stockSheet[`C${row}`]) stockSheet[`C${row}`].z = moneyFormat; if (stockSheet[`H${row}`]) stockSheet[`H${row}`].z = moneyFormat; }
    XLSX.utils.book_append_sheet(workbook, stockSheet, 'Stock Report');

    const cashRows = [['CASH CLOSING & RECONCILIATION', '', ''], ['Field', 'Amount', 'Explanation'], ['Opening Cash', summary.openingCash, 'Cash present when the shop opened'], ['Cash Sales', summary.cash, 'Cash received through completed bills'], ['Expected Closing Cash', summary.openingCash + summary.cash, 'Opening cash + cash sales'], ['Closing Cash Counted', summary.closingCash ?? 'Not entered', 'Physical cash counted at closing'], ['Shortage / Excess', summary.closingCash == null ? 'Not entered' : summary.closingCash - (summary.openingCash + summary.cash), 'Counted cash − expected cash'], ['Closing Notes', summary.notes || '—', 'Saved closing note']];
    const cashSheet = XLSX.utils.aoa_to_sheet(cashRows);
    cashSheet['!merges'] = [XLSX.utils.decode_range('A1:C1')]; cashSheet['!cols'] = [{ wch: 27 }, { wch: 20 }, { wch: 42 }];
    applyRowStyle(cashSheet, 1, 1, 3, titleStyle); decorateTable(cashSheet, 2, cashRows.length, 3);
    for (let row = 3; row <= 7; row += 1) if (cashSheet[`B${row}`] && typeof cashSheet[`B${row}`].v === 'number') cashSheet[`B${row}`].z = moneyFormat;
    XLSX.utils.book_append_sheet(workbook, cashSheet, 'Cash Closing');

    const maxHourly = Math.max(...summary.hourlySales.map((item) => item.amount), 1);
    const hourRows = [['HOURLY SALES ANALYSIS', '', '', ''], ['Hour', 'Bills', 'Sales', 'Visual'], ...summary.hourlySales.map((item) => [item.hour, item.bills, item.amount, `${'█'.repeat(Math.round((item.amount / maxHourly) * 20))}`]), ['TOTAL', summary.bills, summary.total, '']];
    const hourSheet = XLSX.utils.aoa_to_sheet(hourRows);
    hourSheet['!merges'] = [XLSX.utils.decode_range('A1:D1')]; hourSheet['!cols'] = [{ wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 25 }];
    applyRowStyle(hourSheet, 1, 1, 4, titleStyle); decorateTable(hourSheet, 2, hourRows.length, 4); applyRowStyle(hourSheet, hourRows.length, 1, 4, totalStyle);
    for (let row = 3; row <= hourRows.length; row += 1) if (hourSheet[`C${row}`]) hourSheet[`C${row}`].z = moneyFormat;
    XLSX.utils.book_append_sheet(workbook, hourSheet, 'Hourly Sales');

    const paymentRows = [['PAYMENT ANALYSIS', '', '', ''], ['Method', 'Amount', 'Share', 'Visual'], ['Cash', summary.cash, summary.total ? summary.cash / summary.total : 0, bar(summary.cash)], ['UPI', summary.upi, summary.total ? summary.upi / summary.total : 0, bar(summary.upi)], ['Card', summary.card, summary.total ? summary.card / summary.total : 0, bar(summary.card)], ['TOTAL', summary.total, 1, bar(summary.total)]];
    const paymentSheet = XLSX.utils.aoa_to_sheet(paymentRows);
    paymentSheet['!merges'] = [XLSX.utils.decode_range('A1:D1')]; paymentSheet['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 26 }];
    applyRowStyle(paymentSheet, 1, 1, 4, titleStyle); decorateTable(paymentSheet, 2, paymentRows.length, 4); applyRowStyle(paymentSheet, paymentRows.length, 1, 4, totalStyle);
    for (let row = 3; row <= paymentRows.length; row += 1) { if (paymentSheet[`B${row}`]) paymentSheet[`B${row}`].z = moneyFormat; if (paymentSheet[`C${row}`]) paymentSheet[`C${row}`].z = '0.0%'; }
    XLSX.utils.book_append_sheet(workbook, paymentSheet, 'Payment Analysis');

    const shopSheet = XLSX.utils.aoa_to_sheet([['JAI BHOLE SWEETS'], ['Since', '1998'], ['Address', 'In front of Old Water Tank, Main Road, Bisauli, Badaun – 243720'], ['Phone', '7983967977'], ['Report Date', summary.date], [], ['Workbook Guide'], ['Dashboard', 'Day-at-a-glance KPIs and payment visuals'], ['Bill Register', 'One row per completed bill'], ['Bills (Expandable)', 'Use the Excel outline + / − controls to show bill items'], ['Product Sales', 'Quantity, bill count, revenue and share by product'], ['Stock Report', 'Opening, received, sold and remaining stock'], ['Cash Closing', 'Expected versus counted cash'], ['Hourly Sales', 'Sales performance by hour'], ['Payment Analysis', 'Cash, UPI and card mix']]);
    shopSheet['!cols'] = [{ wch: 24 }, { wch: 68 }]; applyRowStyle(shopSheet, 1, 1, 2, titleStyle); applyRowStyle(shopSheet, 7, 1, 2, headerStyle);
    XLSX.utils.book_append_sheet(workbook, shopSheet, 'Workbook Guide');

    workbook.Props = { Title: `Jai Bhole Sweets Daily Report ${summary.date}`, Subject: 'Daily sales, bills, stock and cash closing report', Author: 'Jai Bhole Sweets', Company: 'Jai Bhole Sweets Since 1998' };
    XLSX.writeFile(workbook, `Jai-Bhole-Sweets-Sales-${summary.date}.xlsx`, { compression: true });
  };

  const openStock = async () => {
    try {
      const response = await fetch('/api/stock-today');
      if (!response.ok) throw new Error();
      const data = await response.json() as { items: StockRow[] };
      setStockRows(data.items); setIsStockOpen(true);
    } catch { showFeedback('Daily stock could not be loaded.'); }
  };

  const updateStockField = (id: string, field: 'openingQty' | 'receivedQty', value: number) => {
    setStockRows((rows) => rows.map((row) => row.id === id
      ? { ...row, [field]: Math.max(0, value || 0), closingQty: Math.max(0, (field === 'openingQty' ? value : row.openingQty) + (field === 'receivedQty' ? value : row.receivedQty) - row.soldQty) }
      : row));
  };

  const saveStockRow = async (row: StockRow) => {
    try {
      const response = await fetch(`/api/stock-today/${encodeURIComponent(row.id)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingQty: row.openingQty, receivedQty: row.receivedQty }),
      });
      if (!response.ok) throw new Error();
      showFeedback(`${row.name} stock updated.`);
    } catch { showFeedback('Stock could not be saved.'); }
  };

  const loadSummary = async (date: string) => {
    setSummaryLoading(true);
    try {
      const response = await fetch(`/api/day-summary?date=${encodeURIComponent(date)}`);
      if (!response.ok) throw new Error();
      setSummary(await response.json() as DaySummary);
      setExpandedBill(null);
    } catch { showFeedback('Selected date ka summary load nahi ho saka.'); }
    finally { setSummaryLoading(false); }
  };

  const openSummary = async () => {
    setIsSummaryOpen(true);
    await loadSummary(summaryDate);
  };

  const saveBalance = async () => {
    if (!summary) return;
    try {
      const response = await fetch('/api/day-balance', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: summary.date, openingCash: summary.openingCash, closingCash: summary.closingCash ?? '', notes: summary.notes }),
      });
      if (!response.ok) throw new Error();
      showFeedback('Opening and closing balance saved.');
    } catch { showFeedback('Balance could not be saved.'); }
  };

  return (
    <main className="pos-shell">
      <header className="pos-header">
          <div className="brand-lockup">
          <img className="header-logo" src={receiptLogo} alt="" />
          <div>
            <p className="brand-subtitle">Fresh billing · Since 1998</p>
          </div>
        </div>
        <div className="header-meta">
          <time className="live-clock" dateTime={now.toISOString()} data-testid="text-live-date-time">
            {now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </time>
          <span className="counter-status"><span className="status-dot" /> Counter ready</span>
          <button className="manage-products-button" type="button" onClick={openProductManager} data-testid="button-manage-products">
            <Settings2 size={15} /> Manage products
          </button>
          <div className="header-tools">
            <button className="manage-products-button" type="button" onClick={openStock}><Boxes size={15} /> Daily stock</button>
            <button className="manage-products-button" type="button" onClick={openSummary}><BarChart3 size={15} /> Day summary</button>
          </div>
        </div>
      </header>

      <div className="pos-layout">
        <section className="catalog-panel" aria-labelledby="catalog-heading">
          <div className="catalog-top">
            <div>
              <p className="section-kicker">Fresh from the counter</p>
              <h2 className="catalog-heading" id="catalog-heading">Choose sweets</h2>
            </div>
            <label className="search-wrap">
              <Search className="search-icon" aria-hidden="true" />
              <input
                className="search-input"
                type="search"
                placeholder="Search sweets..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                data-testid="input-search-products"
                aria-label="Search sweets"
              />
            </label>
          </div>

          <div className="category-scroller" role="tablist" aria-label="Product categories">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-chip ${category === item ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={category === item}
                onClick={() => setCategory(item)}
                data-testid={`button-category-${item.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid" aria-live="polite">
            {visibleProducts.length ? visibleProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`product-card ${lastAdded === product.id ? 'added' : ''}`}
                style={{ '--swatch': product.swatch } as CSSProperties}
                onClick={() => addProduct(product)}
                data-testid={`card-product-${product.id}`}
                aria-label={`Add ${product.name}`}
              >
                <div className="product-swatch" aria-hidden="true">{product.mark}</div>
                <div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-category">{product.category}</p>
                   <p className="product-price">{money(product.price)} / {priceUnitLabel(product.unit)}</p>
                </div>
                <span className="add-mark" aria-hidden="true"><Plus size={16} strokeWidth={2.8} /></span>
              </button>
            )) : (
              <div className="empty-products" data-testid="empty-product-results">No sweets found. Try another search.</div>
            )}
          </div>
        </section>

        <aside className="bill-panel" aria-labelledby="bill-heading">
          <div className="bill-header">
            <div>
              <h2 className="bill-title" id="bill-heading">Current bill</h2>
              <p className="bill-no" data-testid="text-bill-number">Bill {billNumber}</p>
              <small>{draftStatus === 'saving' ? 'Saving draft…' : draftStatus === 'saved' ? 'Draft auto-saved ✓' : 'Auto-save ready'}</small>
            </div>
            <time className="bill-date" dateTime={now.toISOString()} data-testid="text-bill-date">
              {now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
            </time>
          </div>

          <div className="cart-list">
            {cart.length ? cart.map((item) => (
              <div className="cart-row" key={item.id} data-testid={`row-cart-item-${item.id}`}>
                <div>
                  <p className="cart-item-name">{item.name}</p>
                   <p className="cart-item-unit">{productTypeLabel(item.unit)} · {money(item.price)} / {priceUnitLabel(item.unit)}</p>
                  <div className="quantity-controls">
                    <button className="quantity-button" type="button" onClick={() => changeQuantity(item.id, -1)} data-testid={`button-decrease-${item.id}`} aria-label={`Decrease ${item.name}`}>
                      <Minus size={14} />
                    </button>
                    <input
                      className="quantity-value"
                      value={item.quantity}
                      type="number"
                       min={isWeightUnit(item.unit) ? '50' : '0.001'}
                       step={isWeightUnit(item.unit) ? '50' : isVolumeUnit(item.unit) ? '0.25' : '1'}
                      onChange={(event) => setQuantity(item.id, event.target.value)}
                      data-testid={`input-quantity-${item.id}`}
                        aria-label={`${item.name} ${isWeightUnit(item.unit) ? 'quantity in grams' : isVolumeUnit(item.unit) ? 'quantity in litres or millilitres' : 'quantity in pieces'}`}
                    />
                     <span className="quantity-unit-badge" data-testid={`text-quantity-label-${item.id}`}>
                       {quantityLabel(item)}
                     </span>
                    <button className="quantity-button" type="button" onClick={() => changeQuantity(item.id, 1)} data-testid={`button-increase-${item.id}`} aria-label={`Increase ${item.name}`}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <strong className="cart-item-total" data-testid={`text-item-total-${item.id}`}>{money(itemPrice(item))}</strong>
              </div>
            )) : (
              <div className="cart-empty" data-testid="empty-current-bill">
                <ShoppingBag size={30} strokeWidth={1.6} />
                <strong>Your bill is empty</strong>
                <span>Tap any sweet on the left to start a fresh bill.</span>
              </div>
            )}
          </div>

          <div className="bill-form">
            <div className="customer-fields">
              <label><span>Customer name</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Walk-in customer" /></label>
              <label><span>Mobile</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Optional" inputMode="numeric" /></label>
            </div>
            <label className="discount-row">
              <span>Discount</span>
              <input
                className="discount-input"
                type="number"
                min="0"
                value={discount || ''}
                placeholder="₹ 0"
                onChange={(event) => setDiscount(Math.max(0, Number(event.target.value) || 0))}
                data-testid="input-discount"
                aria-label="Discount in rupees"
              />
            </label>
            <div className="totals">
              <div className="total-line"><span>Subtotal</span><strong data-testid="text-subtotal">{money(subtotal)}</strong></div>
              <div className="total-line"><span>Discount</span><strong data-testid="text-discount">− {money(appliedDiscount)}</strong></div>
              <div className="total-line grand-total"><span>Total payable</span><strong data-testid="text-grand-total">{money(grandTotal)}</strong></div>
            </div>
          </div>

          <div className="payment-section">
            <span className="payment-label">Payment method</span>
            <div className="payment-options" role="radiogroup" aria-label="Payment method">
              {([
                ['Cash', Banknote],
                ['UPI', Smartphone],
                ['Card', CreditCard],
              ] as const).map(([method, Icon]) => (
                <button
                  key={method}
                  className={`payment-option ${payment === method ? 'active' : ''}`}
                  type="button"
                  role="radio"
                  aria-checked={payment === method}
                  onClick={() => setPayment(method)}
                  data-testid={`button-payment-${method.toLowerCase()}`}
                >
                  <Icon size={15} />
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="bill-actions">
            <button className="action-button danger" type="button" onClick={clearBill} data-testid="button-clear-bill">
              <Trash2 size={16} /> Clear bill
            </button>
            <button className="action-button" type="button" onClick={printBill} data-testid="button-print-bill">
              <Printer size={16} /> Print bill
            </button>
            <button className="action-button primary wide" type="button" onClick={() => completeBill()} disabled={isSaving} data-testid="button-save-bill">
              <ReceiptText size={17} /> {isSaving ? 'Completing…' : 'Complete & next bill'} <Check size={16} />
            </button>
          </div>
        </aside>
      </div>

      {isProductManagerOpen && (
        <div className="product-manager-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsProductManagerOpen(false);
        }}>
          <section className="product-manager" role="dialog" aria-modal="true" aria-labelledby="product-manager-heading">
            <div className="product-manager-header">
              <div>
                <p className="section-kicker">Catalog setup</p>
                <h2 className="product-manager-title" id="product-manager-heading">Manage products</h2>
                <p className="product-manager-subtitle">Keep your billing catalog ready for the counter.</p>
              </div>
              <button className="icon-button" type="button" onClick={() => setIsProductManagerOpen(false)} aria-label="Close product manager">
                <X size={19} />
              </button>
            </div>

            <div className="product-manager-layout">
              <div className="product-manager-list">
                <button className="add-product-button" type="button" onClick={startNewProduct} data-testid="button-add-product">
                  <Plus size={16} /> Add new product
                </button>
                <div className="manager-list-heading">
                  <span>{products.length} products</span>
                  <span>{products.filter((product) => product.active).length} active</span>
                </div>
                <div className="manager-products" role="list" aria-label="Products">
                  {products.map((product) => (
                    <div className={`manager-product-row ${editingProductId === product.id ? 'selected' : ''}`} key={product.id} role="listitem">
                      <button className="manager-product-select" type="button" onClick={() => selectProductForEdit(product)} data-testid={`button-edit-product-${product.id}`}>
                        <span className="manager-product-mark" style={{ '--swatch': product.swatch } as CSSProperties}>{product.mark}</span>
                        <span className="manager-product-copy">
                          <strong>{product.name}</strong>
                          <small>{product.category} · {productTypeLabel(product.unit)}</small>
                        </span>
                        <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>{product.active ? 'Active' : 'Off'}</span>
                      </button>
                      <button className="manager-edit-button" type="button" onClick={() => selectProductForEdit(product)} aria-label={`Edit ${product.name}`}>
                        <Edit3 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-editor">
                <div className="product-editor-heading">
                  <div>
                    <span className="form-eyebrow">{editingProductId ? 'Edit product' : 'New product'}</span>
                    <h3>{editingProductId ? productDraft.name || 'Product details' : 'Add a sweet'}</h3>
                  </div>
                  {editingProductId && (
                    <button
                      className={`toggle-status-button ${productDraft.active ? '' : 'off'}`}
                      type="button"
                      onClick={() => setProductDraft((current) => ({ ...current, active: !current.active }))}
                    >
                      <span className="toggle-dot" />
                      {productDraft.active ? 'Active for billing' : 'Inactive'}
                    </button>
                  )}
                </div>

                <div className="product-form-grid">
                  <label className="product-field full">
                    <span>Product name</span>
                    <input
                      value={productDraft.name}
                      onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
                      placeholder="e.g. Imarti"
                      data-testid="input-product-name"
                    />
                  </label>
                  <label className="product-field">
                    <span>Selling price</span>
                    <div className="price-field">
                      <b>₹</b>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={productDraft.price}
                        onChange={(event) => setProductDraft((current) => ({ ...current, price: event.target.value }))}
                        placeholder="520"
                        data-testid="input-product-price"
                      />
                    </div>
                    <small>{priceBasisLabel(productDraft.unit)}</small>
                  </label>
                  <label className="product-field">
                    <span>Category</span>
                    <select
                      value={productDraft.category}
                      onChange={(event) => setProductDraft((current) => ({ ...current, category: event.target.value as ProductCategory }))}
                      data-testid="select-product-category"
                    >
                      {productCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="product-field full">
                    <span>Billing unit</span>
                    <select
                      value={productDraft.unit}
                      onChange={(event) => setProductDraft((current) => ({ ...current, unit: event.target.value as Unit }))}
                      data-testid="select-product-unit"
                    >
                      <option value="kg">Weight · kg</option>
                      <option value="g">Weight · g</option>
                      <option value="piece">Pieces · pc</option>
                      <option value="litre">Volume · litre</option>
                    </select>
                    <small>Weight products use grams in the bill; litre products use litres.</small>
                  </label>
                </div>

                <div className="product-editor-footer">
                  {editingProductId ? (
                    <button className="secondary-editor-button" type="button" onClick={() => {
                      const selected = products.find((product) => product.id === editingProductId);
                      if (selected) toggleProductActive(selected);
                    }}>
                      {productDraft.active ? 'Deactivate product' : 'Activate product'}
                    </button>
                  ) : <span className="editor-hint">New products start active.</span>}
                  <button className="save-product-button" type="button" onClick={saveProduct} disabled={isProductSaving} data-testid="button-save-product">
                    <Check size={16} /> {isProductSaving ? 'Saving…' : 'Save product'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {isStockOpen && (
        <div className="product-manager-overlay" role="presentation">
          <section className="operations-dialog" role="dialog" aria-modal="true" aria-labelledby="stock-heading">
            <div className="product-manager-header"><div><p className="section-kicker">Today’s inventory</p><h2 id="stock-heading" className="product-manager-title">Daily stock management</h2><p className="product-manager-subtitle">Opening + received − sold = stock remaining tonight. Weight is entered in kg.</p></div><button className="icon-button" onClick={() => setIsStockOpen(false)} aria-label="Close"><X size={19}/></button></div>
            <div className="stock-table-wrap"><table className="operations-table"><thead><tr><th>Product</th><th>Opening</th><th>New stock</th><th>Sold</th><th>Remaining</th><th></th></tr></thead><tbody>
              {stockRows.map((row) => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.unit === 'piece' ? 'pieces' : row.unit}</small></td><td><input type="number" min="0" step="0.001" value={row.openingQty} onChange={(e) => updateStockField(row.id, 'openingQty', Number(e.target.value))}/></td><td><input type="number" min="0" step="0.001" value={row.receivedQty} onChange={(e) => updateStockField(row.id, 'receivedQty', Number(e.target.value))}/></td><td>{row.soldQty.toFixed(3)}</td><td><strong>{row.closingQty.toFixed(3)}</strong></td><td><button className="table-save" onClick={() => saveStockRow(row)}>Save</button></td></tr>)}
            </tbody></table></div>
          </section>
        </div>
      )}

      {isSummaryOpen && summary && (
        <div className="product-manager-overlay" role="presentation">
          <section className="operations-dialog summary-dialog" role="dialog" aria-modal="true" aria-labelledby="summary-heading">
            <div className="product-manager-header"><div><p className="section-kicker">Sales history</p><h2 id="summary-heading" className="product-manager-title">Daily sales summary</h2><label className="summary-date-filter"><span>View business date</span><input type="date" value={summaryDate} max={currentBusinessDate()} onChange={(event) => { const date = event.target.value; setSummaryDate(date); if (date) void loadSummary(date); }}/></label></div><button className="icon-button" onClick={() => setIsSummaryOpen(false)} aria-label="Close"><X size={19}/></button></div>
            <div className="summary-content">
              {summaryLoading && <div className="summary-loading">Loading {summaryDate} sales…</div>}
              <div className="summary-cards"><article className="summary-card featured"><span>Total sales</span><strong>{money(summary.total)}</strong><small>{summary.bills} bills</small></article><article className="summary-card"><span>Cash</span><strong>{money(summary.cash)}</strong></article><article className="summary-card"><span>UPI</span><strong>{money(summary.upi)}</strong></article><article className="summary-card"><span>Card</span><strong>{money(summary.card)}</strong></article></div>
              <div className="stock-table-wrap"><table className="operations-table"><thead><tr><th>Item sold</th><th>Quantity</th><th>Sales</th></tr></thead><tbody>
                {summary.itemSales.map((item) => <tr key={`${item.productName}-${item.unit}`}><td><strong>{item.productName}</strong></td><td>{item.quantity.toFixed(3)} {item.unit}</td><td><strong>{money(item.amount)}</strong></td></tr>)}
              </tbody></table></div>
              <div className="stock-table-wrap"><table className="operations-table order-history-table"><thead><tr><th>Bill</th><th>Customer</th><th>Payment</th><th>Total</th></tr></thead><tbody>
                {summary.invoices.map((invoice) => <Fragment key={invoice.billNumber}>
                  <tr className="order-summary-row" onClick={() => setExpandedBill((current) => current === invoice.billNumber ? null : invoice.billNumber)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setExpandedBill((current) => current === invoice.billNumber ? null : invoice.billNumber); }}>
                    <td><strong>{invoice.billNumber}</strong><small>{new Date(invoice.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {expandedBill === invoice.billNumber ? 'Hide details' : 'View order'}</small></td><td>{invoice.customerName || 'Walk-in'}{invoice.customerPhone && <small>{invoice.customerPhone}</small>}</td><td>{invoice.paymentMethod}</td><td><strong>{money(invoice.grandTotal)}</strong></td>
                  </tr>
                  {expandedBill === invoice.billNumber && <tr key={`${invoice.billNumber}-details`} className="order-detail-row"><td colSpan={4}>
                    <div className="order-detail-card"><div className="order-detail-heading"><strong>Order details</strong><span>{invoice.items.length} item{invoice.items.length === 1 ? '' : 's'}</span></div>
                      {invoice.items.map((item, index) => <div className="order-detail-item" key={`${invoice.billNumber}-${item.productName}-${index}`}><span>{item.productName}<small>{item.quantity} {item.unit} × {money(item.rate)}</small></span><strong>{money(item.amount)}</strong></div>)}
                      <div className="order-detail-totals"><span>Subtotal <b>{money(invoice.subtotal)}</b></span><span>Discount <b>− {money(invoice.discount)}</b></span><span className="final">Paid via {invoice.paymentMethod} <b>{money(invoice.grandTotal)}</b></span></div>
                    </div>
                  </td></tr>}
                </Fragment>)}
              </tbody></table></div>
              <div className="balance-form"><label><span>Opening cash balance</span><input type="number" min="0" value={summary.openingCash} onChange={(e) => setSummary({ ...summary, openingCash: Number(e.target.value) })}/></label><label><span>Closing cash counted</span><input type="number" min="0" value={summary.closingCash ?? ''} placeholder="Enter at night" onChange={(e) => setSummary({ ...summary, closingCash: e.target.value === '' ? null : Number(e.target.value) })}/></label><label className="wide"><span>Closing notes</span><input value={summary.notes} placeholder="Any shortage, excess or note…" onChange={(e) => setSummary({ ...summary, notes: e.target.value })}/></label></div>
              <div className="expected-cash"><span>Expected closing cash</span><strong>{money(summary.openingCash + summary.cash)}</strong></div>
              <div className="header-tools"><button className="manage-products-button" onClick={downloadDayReport}><Download size={16}/> Download Excel report</button><button className="save-product-button summary-save" onClick={saveBalance}><Check size={16}/> Save day balance</button></div>
            </div>
          </section>
        </div>
      )}

      <section className="print-receipt" aria-label="Printable receipt">
        <div className="print-receipt-brand">
          <img className="print-receipt-logo" src={receiptLogo} alt="Jai Bhole Sweets official seal" />
          <p className="print-receipt-tagline">Freshness you can taste, sweetness you can trust.</p>
          <p className="print-shop-details">In front of Old Water Tank, Main Road, Bisauli, Badaun – 243720<br/>Ph: 7983967977</p>
          <p className="print-receipt-type">RETAIL INVOICE</p>
        </div>

        <div className="print-divider" />

        <div className="print-customer">
          <span>Customer: <strong>{printable.customerName.trim() || 'Walk-in Customer'}</strong></span>
          {printable.customerPhone.trim() && <span>Mobile: <strong>{printable.customerPhone}</strong></span>}
        </div>

        <div className="print-divider" />

        <div className="print-receipt-meta">
          <span>Bill No. <strong>{printable.billNumber}</strong></span>
          <span>{printable.printedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span>{printable.printedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="print-divider" />

        <table className="print-item-table">
          <thead>
            <tr>
              <th scope="col">S.No.</th>
              <th scope="col">Item</th>
              <th scope="col">Qty/Weight</th>
              <th scope="col">Rate</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {printable.cart.length ? printable.cart.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{quantityLabel(item)}</td>
                <td>{money(item.price)} / {priceUnitLabel(item.unit)}</td>
                <td>{money(itemPrice(item))}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="print-empty-row">No items</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="print-divider" />

        <div className="print-summary">
          <div><span>Subtotal</span><strong>{money(printable.subtotal)}</strong></div>
          <div><span>Discount</span><strong>− {money(printable.discount)}</strong></div>
          <div className="print-total"><span>TOTAL PAYABLE</span><strong>{money(printable.grandTotal)}</strong></div>
        </div>

        <div className="print-divider" />

        <div className="print-payment">
          <span>Payment Method</span>
          <strong>{printable.payment}</strong>
        </div>

        <div className="print-receipt-footer">
          <strong>Thank you for making life mithaas-bhari!</strong>
          <span>Calories don't count when the mithai is this good. ✦ Visit again!</span>
          <small>Computer-generated invoice · Jai Bhole Sweets © 1998–{now.getFullYear()}</small>
        </div>
      </section>

      {feedback && (
        <div className="feedback" role="status" data-testid="status-feedback">
          <Check size={16} /> {feedback}
        </div>
      )}
    </main>
  );
}

export default App;
