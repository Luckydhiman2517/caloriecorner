import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

/**
 * The Calorie Corner line-icon set (Brand guidelines · 06 Iconography).
 * 24px grid, rounded caps and joins, coloured with `color`.
 * Every path is copied from the design files.
 */
type Shape =
  | { p: string }
  | { c: [number, number, number] }
  | { r: [number, number, number, number, number] };

const ICONS = {
  check: [{ p: 'M5 12.5l4.5 4.5L19 7' }],
  chevronLeft: [{ p: 'M15 18l-6-6 6-6' }],
  chevronRight: [{ p: 'M9 6l6 6-6 6' }],
  chevronDown: [{ p: 'M6 9l6 6 6-6' }],
  plus: [{ p: 'M12 5v14M5 12h14' }],
  minus: [{ p: 'M5 12h14' }],
  x: [{ p: 'M6 6l12 12M18 6L6 18' }],
  trash: [{ p: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13' }],
  search: [{ c: [11, 11, 7] }, { p: 'M20 20l-3.5-3.5' }],
  pin: [
    { p: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z' },
    { c: [12, 9.5, 2.5] },
  ],
  pinOff: [
    { p: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z' },
    { c: [12, 9.5, 2.5] },
    { p: 'M4 4l16 16' },
  ],
  home: [{ p: 'M3 10.5L12 3l9 7.5' }, { p: 'M5 9.5V20h14V9.5' }],
  orders: [{ p: 'M6 3h12v18l-3-2-3 2-3-2-3 2z' }, { p: 'M9 8h6M9 12h6' }],
  user: [{ c: [12, 8, 4] }, { p: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6' }],
  bag: [{ p: 'M5 8h14l-1 13H6z' }, { p: 'M9 8V6a3 3 0 0 1 6 0v2' }],
  forkKnife: [
    { p: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10' },
    { p: 'M17 3c-2 0-3 2.5-3 6s1.5 4 3 4v8' },
  ],
  flame: [
    {
      p: 'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 0 2 1 3 2 3 0-3-1-5.5.5-8z',
    },
  ],
  target: [{ c: [12, 12, 9] }, { c: [12, 12, 5] }, { c: [12, 12, 1] }],
  clock: [{ c: [12, 12, 9] }, { p: 'M12 7v5l3 2' }],
  leaf: [
    { p: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15' },
    { p: 'M5 19c3-4 6-6 9-7' },
  ],
  phone: [{ r: [6, 3, 12, 18, 2.5] }, { p: 'M10 18h4' }],
  call: [
    {
      p: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
    },
  ],
  mail: [{ r: [3, 5, 18, 14, 2] }, { p: 'M3 7l9 6 9-6' }],
  locate: [{ c: [12, 12, 4] }, { p: 'M12 2v3M12 19v3M2 12h3M19 12h3' }],
  trendingDown: [{ p: 'M3 7l6 6 4-4 8 8' }, { p: 'M21 11v6h-6' }],
  trendingUp: [{ p: 'M3 17l6-6 4 4 8-8' }, { p: 'M21 13V7h-6' }],
  dumbbell: [{ p: 'M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12' }],
  maintain: [{ p: 'M5 9h14M5 15h14' }],
  alertCircle: [{ c: [12, 12, 9] }, { p: 'M12 7.5v5.5M12 16.5v.01' }],
  info: [{ c: [12, 12, 9] }, { p: 'M12 11v5.5' }, { p: 'M12 7.6v.1' }],
  help: [
    { c: [12, 12, 9] },
    { p: 'M9.6 9.4a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.1-2.4 3.6' },
    { p: 'M12 17.2v.1' },
  ],
  helpAlt: [
    { c: [12, 12, 9] },
    { p: 'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.4' },
    { p: 'M12 17h.01' },
  ],
  lock: [{ r: [5, 11, 14, 10, 2] }, { p: 'M8 11V8a4 4 0 0 1 8 0v3' }],
  card: [{ r: [3, 5, 18, 14, 2] }, { p: 'M3 10h18M7 15h3' }],
  cash: [
    { r: [3, 6, 18, 12, 2] },
    { c: [12, 12, 2.5] },
    { p: 'M6.5 9.5h.01M17.5 14.5h.01' },
  ],
  wallet: [
    { p: 'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z' },
    { p: 'M4 7l11-3v3' },
    { c: [16, 13.5, 1] },
  ],
  calendar: [{ r: [3, 5, 18, 16, 2] }, { p: 'M3 10h18M8 3v4M16 3v4' }],
  sortDown: [{ p: 'M4 6h10M4 12h7M4 18h4' }, { p: 'M18 6v12M15 15l3 3 3-3' }],
  flag: [{ p: 'M5 21V4h11l-1.5 4L16 12H5' }],
  tag: [{ p: 'M20 12.5l-7.5 7.5L3 10.5V3h7.5z' }, { c: [7.5, 7.5, 1.5] }],
  share: [
    { c: [18, 5, 3] },
    { c: [6, 12, 3] },
    { c: [18, 19, 3] },
    { p: 'M8.6 13.5l6.8 4M15.4 6.5l-6.8 4' },
  ],
  sliders: [
    { p: 'M4 7h9M17 7h3M4 17h3M11 17h9' },
    { c: [15, 7, 2] },
    { c: [9, 17, 2] },
  ],
  bell: [
    { p: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z' },
    { p: 'M10 20.5a2 2 0 0 0 4 0' },
  ],
  logout: [
    { p: 'M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4' },
    { p: 'M15 16l4-4-4-4' },
    { p: 'M19 12H9' },
  ],
  move: [
    {
      p: 'M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3',
    },
  ],
  briefcase: [{ r: [3, 7, 18, 13, 2] }, { p: 'M9 7V5h6v2' }],
  scooter: [
    { c: [6, 17, 3] },
    { c: [18, 17, 3] },
    { p: 'M6 17l4-8h5l3 8' },
    { p: 'M8.5 6H12' },
  ],
  heart: [
    {
      p: 'M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z',
    },
  ],
} satisfies Record<string, Shape[]>;

/** Filled (not stroked) icons. */
const FILLED = {
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
} as const;

export type IconName = keyof typeof ICONS | keyof typeof FILLED;

/** Stroke widths per size (16 · 2, 20 · 1.8, 24 · 1.6; 22 · 1.8; 14 check · 2.8). */
const DEFAULT_STROKE: Record<number, number> = {
  14: 2.8,
  16: 2,
  20: 1.8,
  22: 1.8,
  24: 1.6,
};

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 20,
  color = colors.forestInk,
  strokeWidth,
}: Props) {
  if (name in FILLED) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={FILLED[name as keyof typeof FILLED]} fill={color} />
      </Svg>
    );
  }
  const sw = strokeWidth ?? DEFAULT_STROKE[size] ?? 1.8;
  const shapes = ICONS[name as keyof typeof ICONS] as Shape[];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes.map((s, i) => {
        if ('p' in s) {
          return <Path key={i} d={s.p} />;
        }
        if ('c' in s) {
          return <Circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} />;
        }
        return (
          <Rect
            key={i}
            x={s.r[0]}
            y={s.r[1]}
            width={s.r[2]}
            height={s.r[3]}
            rx={s.r[4]}
          />
        );
      })}
    </Svg>
  );
}
