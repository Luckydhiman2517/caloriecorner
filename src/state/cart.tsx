import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ImageSourcePropType } from 'react-native';
import { images } from '../assets/images';

/**
 * Cart state shared by Cart, Checkout, Tracking and the shop cart bars.
 * Product data, fees and coupons are static sample data from the design;
 * every total on screen is derived here so they always agree.
 */

export type Diet = 'veg' | 'nonveg';

type PortionValues = { kcal: number; price: number; protein: number };

export type Product = {
  id: string;
  kind: 'meal' | 'grocery';
  name: string;
  diet: Diet;
  image?: ImageSourcePropType;
  photoLabel: string;
  /** Kitchen (meals) or brand line shown under the name. */
  meta: string;
  kitchen?: string;
  /** Meals: kcal per item. Groceries: kcal per 100 g (not counted today). */
  kcal: number;
  unit?: string;
  price: number;
  protein?: number;
  /** Shows the "Edit" portion link (→ Meal). */
  editable?: boolean;
  /** Lighter portion offered by "Swap & save" (Meal screen: Light). */
  light?: PortionValues;
  /** Name used in the Swap & save card, e.g. "paneer bowl". */
  shortName?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'paneer',
    kind: 'meal',
    name: 'Paneer tikka millet bowl',
    diet: 'veg',
    photoLabel: 'Paneer tikka millet bowl, photo coming soon',
    meta: 'Green Fork Kitchen',
    kitchen: 'Green Fork Kitchen',
    kcal: 420,
    price: 249,
    protein: 28,
    editable: true,
    light: { kcal: 330, price: 229, protein: 26 },
    shortName: 'paneer bowl',
  },
  {
    id: 'omelette',
    kind: 'meal',
    name: 'Egg white veggie omelette',
    diet: 'nonveg',
    image: images.eggsThumb,
    photoLabel: 'Egg white veggie omelette',
    meta: 'Protein Pot · Contains egg',
    kitchen: 'Protein Pot',
    kcal: 260,
    price: 179,
    protein: 24,
  },
  {
    id: 'chaat',
    kind: 'meal',
    name: 'Moong sprout chaat',
    diet: 'veg',
    image: images.moongSproutsThumb,
    photoLabel: 'Moong sprout chaat',
    meta: 'Millet Mama',
    kitchen: 'Millet Mama',
    kcal: 180,
    price: 149,
    protein: 10,
  },
  {
    id: 'yogurt',
    kind: 'grocery',
    name: 'Unsweetened Greek yogurt',
    diet: 'veg',
    image: images.greekYogurtThumb,
    photoLabel: 'Unsweetened Greek yogurt',
    meta: '400 g · 380 kcal pack',
    kcal: 95,
    unit: 'kcal/100 g',
    price: 180,
  },
  {
    id: 'blueberries',
    kind: 'grocery',
    name: 'Blueberries',
    diet: 'veg',
    image: images.blueberriesThumb,
    photoLabel: 'Blueberries',
    meta: '125 g · 71 kcal pack',
    kcal: 57,
    unit: 'kcal/100 g',
    price: 299,
  },
];

/** Shown in "Add more" until they are in the cart. */
export const ADD_ON_IDS = ['chaat', 'blueberries'];

// Today, from the user's goal (Lose weight · 1,600 kcal, 120 g protein).
export const DAY_TARGET = 1600;
export const DAY_EATEN = 580;
export const PROTEIN_TARGET = 120;

export const DELIVERY_FEE = 25;
export const PLATFORM_FEE = 9;
/** "GST & charges": 5% of the item total after any coupon, rounded up. */
const GST_RATE = 0.05;

export type Coupon = {
  code: string;
  title: string;
  detail: string;
  /** Item total needed to use the code. */
  minOrder: number;
  percentOff?: number;
  maxOff?: number;
  flatOff?: number;
  freeDelivery?: boolean;
};

export const COUPONS: Coupon[] = [
  {
    code: 'FIT50',
    title: '50% off up to ₹100',
    detail: 'On orders above ₹399',
    minOrder: 399,
    percentOff: 50,
    maxOff: 100,
  },
  {
    code: 'FIRST75',
    title: 'Flat ₹75 off',
    detail: 'On your first order above ₹299',
    minOrder: 299,
    flatOff: 75,
  },
  {
    code: 'FREEDEL',
    title: 'Free delivery',
    detail: 'On orders above ₹499',
    minOrder: 499,
    freeDelivery: true,
  },
];

/* ───────────── formatting ───────────── */

/** Indian digit grouping: 1520 → "1,520", 152000 → "1,52,000". */
export function groupDigits(n: number): string {
  const [whole, frac] = String(Math.abs(Math.round(n * 100) / 100)).split('.');
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = rest ? `${rest},${last3}` : last3;
  return `${n < 0 ? '-' : ''}${grouped}${frac ? `.${frac}` : ''}`;
}

export const inr = (n: number) => `₹${groupDigits(n)}`;

export const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/* ───────────── totals ───────────── */

export type CartLine = {
  product: Product;
  qty: number;
  /** True when "Swap & save" switched it to the Light portion. */
  isLight: boolean;
  kcal: number;
  price: number;
  protein: number;
};

export type Totals = {
  lines: CartLine[];
  meals: CartLine[];
  groceries: CartLine[];
  mealUnits: number;
  groceryUnits: number;
  items: number;
  kitchens: number;
  /** kcal counted toward today (meals only). */
  mealKcal: number;
  protein: number;
  itemTotal: number;
  coupon: Coupon | null;
  /** Rupees still needed before the applied coupon works (0 = it works). */
  couponShortfall: number;
  discount: number;
  delivery: number;
  platform: number;
  gst: number;
  toPay: number;
  /** % of today's target this order adds. */
  dayPct: number;
  /** kcal left today after this order; negative when over. */
  dayLeft: number;
  proteinPct: number;
};

export function couponDiscount(c: Coupon, itemTotal: number): number {
  if (c.flatOff) {
    return Math.min(c.flatOff, itemTotal);
  }
  if (c.percentOff) {
    const off = Math.floor((itemTotal * c.percentOff) / 100);
    return c.maxOff ? Math.min(c.maxOff, off) : off;
  }
  return 0;
}

export function computeTotals(
  qty: Record<string, number>,
  light: Record<string, boolean>,
  couponCode: string | null,
): Totals {
  const lines: CartLine[] = PRODUCTS.filter(p => (qty[p.id] ?? 0) > 0).map(
    product => {
      const isLight = !!(light[product.id] && product.light);
      const v = isLight && product.light ? product.light : product;
      return {
        product,
        qty: qty[product.id],
        isLight,
        kcal: v.kcal,
        price: v.price,
        protein: v.protein ?? 0,
      };
    },
  );
  const meals = lines.filter(l => l.product.kind === 'meal');
  const groceries = lines.filter(l => l.product.kind === 'grocery');
  const sum = (ls: CartLine[], f: (l: CartLine) => number) =>
    ls.reduce((t, l) => t + f(l), 0);

  const mealUnits = sum(meals, l => l.qty);
  const groceryUnits = sum(groceries, l => l.qty);
  const items = mealUnits + groceryUnits;
  const mealKcal = sum(meals, l => l.qty * l.kcal);
  const protein = sum(meals, l => l.qty * l.protein);
  const itemTotal = sum(lines, l => l.qty * l.price);

  const coupon = COUPONS.find(c => c.code === couponCode) ?? null;
  const couponShortfall = coupon ? Math.max(0, coupon.minOrder - itemTotal) : 0;
  const couponOn = !!coupon && couponShortfall === 0 && items > 0;
  const discount = couponOn && coupon ? couponDiscount(coupon, itemTotal) : 0;
  const delivery = couponOn && coupon?.freeDelivery ? 0 : DELIVERY_FEE;
  const gst = Math.ceil((itemTotal - discount) * GST_RATE);
  const toPay = items
    ? itemTotal - discount + delivery + PLATFORM_FEE + gst
    : 0;

  return {
    lines,
    meals,
    groceries,
    mealUnits,
    groceryUnits,
    items,
    kitchens: new Set(meals.map(l => l.product.kitchen)).size,
    mealKcal,
    protein,
    itemTotal,
    coupon,
    couponShortfall,
    discount,
    delivery,
    platform: PLATFORM_FEE,
    gst,
    toPay,
    dayPct: Math.round((mealKcal / DAY_TARGET) * 100),
    dayLeft: DAY_TARGET - DAY_EATEN - mealKcal,
    proteinPct: Math.round((protein / PROTEIN_TARGET) * 100),
  };
}

/** "2 meals · 680 kcal + 1 grocery" */
export function orderSummary(t: Totals): string {
  const parts: string[] = [];
  if (t.mealUnits) {
    parts.push(
      `${plural(t.mealUnits, 'meal', 'meals')} · ${groupDigits(
        t.mealKcal,
      )} kcal`,
    );
  }
  if (t.groceryUnits) {
    parts.push(plural(t.groceryUnits, 'grocery', 'groceries'));
  }
  return parts.join(' + ') || 'Nothing added yet';
}

/* ───────────── store ───────────── */

type CartContextValue = Totals & {
  qtyOf: (id: string) => number;
  setQty: (id: string, qty: number) => void;
  add: (id: string) => void;
  setLight: (id: string, on: boolean) => void;
  /** Returns an error message, or null when the code was applied. */
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const INITIAL_QTY: Record<string, number> = {
  paneer: 1,
  omelette: 1,
  yogurt: 1,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [qty, setQtyState] = useState(INITIAL_QTY);
  const [light, setLightState] = useState<Record<string, boolean>>({});
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const totals = useMemo(
    () => computeTotals(qty, light, couponCode),
    [qty, light, couponCode],
  );

  const setQty = useCallback((id: string, q: number) => {
    setQtyState(prev => ({ ...prev, [id]: Math.max(0, Math.min(20, q)) }));
  }, []);
  const add = useCallback((id: string) => {
    setQtyState(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);
  const setLight = useCallback((id: string, on: boolean) => {
    setLightState(prev => ({ ...prev, [id]: on }));
  }, []);

  const applyCoupon = useCallback(
    (raw: string) => {
      const code = raw.replace(/\s/g, '').toUpperCase();
      const c = COUPONS.find(x => x.code === code);
      if (!c) {
        return 'That code isn’t valid. Check it and try again.';
      }
      const short = c.minOrder - totals.itemTotal;
      if (short > 0) {
        return `Add ${inr(short)} more to use ${c.code}`;
      }
      setCouponCode(c.code);
      return null;
    },
    [totals.itemTotal],
  );
  const removeCoupon = useCallback(() => setCouponCode(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      ...totals,
      qtyOf: (id: string) => qty[id] ?? 0,
      setQty,
      add,
      setLight,
      applyCoupon,
      removeCoupon,
    }),
    [totals, qty, setQty, add, setLight, applyCoupon, removeCoupon],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
