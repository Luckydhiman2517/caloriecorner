import { computeTotals, groupDigits, orderSummary } from '../src/state/cart';

const BASE = { paneer: 1, omelette: 1, yogurt: 1 };

describe('cart totals', () => {
  it('reproduces the design numbers', () => {
    const t = computeTotals(BASE, {}, null);
    expect(t.itemTotal).toBe(608);
    expect(t.delivery).toBe(25);
    expect(t.platform).toBe(9);
    expect(t.gst).toBe(31);
    expect(t.toPay).toBe(673);
    expect(t.items).toBe(3);
    expect(t.mealKcal).toBe(680);
    expect(t.dayPct).toBe(43);
    expect(t.dayLeft).toBe(340);
    expect(t.protein).toBe(52);
    expect(t.proteinPct).toBe(43);
    expect(t.kitchens).toBe(2);
    expect(orderSummary(t)).toBe('2 meals · 680 kcal + 1 grocery');
  });

  it('follows quantity changes', () => {
    const t = computeTotals({ ...BASE, paneer: 3 }, {}, null);
    expect(t.itemTotal).toBe(1106);
    expect(t.gst).toBe(56);
    expect(t.toPay).toBe(1196);
    expect(t.items).toBe(5);
    expect(t.mealKcal).toBe(1520);
    expect(t.dayLeft).toBe(-500);
    expect(orderSummary(t)).toBe('4 meals · 1,520 kcal + 1 grocery');
  });

  it('applies the Light swap', () => {
    const t = computeTotals(BASE, { paneer: true }, null);
    expect(t.lines[0].isLight).toBe(true);
    expect(t.itemTotal).toBe(588);
    expect(t.toPay).toBe(652);
    expect(t.mealKcal).toBe(590);
    expect(t.protein).toBe(50);
  });

  it('applies coupons', () => {
    const fit = computeTotals(BASE, {}, 'FIT50');
    expect(fit.discount).toBe(100);
    expect(fit.gst).toBe(26);
    expect(fit.toPay).toBe(568);

    const free = computeTotals(BASE, {}, 'FREEDEL');
    expect(free.discount).toBe(0);
    expect(free.delivery).toBe(0);
    expect(free.toPay).toBe(648);

    const first = computeTotals(BASE, {}, 'FIRST75');
    expect(first.discount).toBe(75);
  });

  it('holds a coupon back until the minimum is met', () => {
    const t = computeTotals({ yogurt: 1 }, {}, 'FIT50');
    expect(t.couponShortfall).toBe(219);
    expect(t.discount).toBe(0);
    expect(t.toPay).toBe(223);
  });

  it('is empty with nothing in it', () => {
    const t = computeTotals({}, {}, 'FIT50');
    expect(t.items).toBe(0);
    expect(t.toPay).toBe(0);
    expect(orderSummary(t)).toBe('Nothing added yet');
  });
});

describe('groupDigits', () => {
  it('uses Indian grouping', () => {
    expect(groupDigits(999)).toBe('999');
    expect(groupDigits(1520)).toBe('1,520');
    expect(groupDigits(152000)).toBe('1,52,000');
  });
});
