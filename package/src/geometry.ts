import dayjs from 'dayjs';

// --- Pure helper functions (extracted from RealClock, now module-level) ---

/** Normalize angle to [0, 360) */
export const normalizeAngle = (deg: number): number => ((deg % 360) + 360) % 360;

/** Format number for SVG path precision */
const fmt = (n: number): string => (Number.isFinite(n) ? n.toFixed(3) : '0');

/** Compute second hand angle from a Date, respecting timezone */
export function secondAngleFromDate(d: Date | null | undefined, tz?: string): number {
  if (!d) {
    return 0;
  }
  const dt = tz && tz !== '' ? dayjs(d).tz(tz) : dayjs(d);
  return normalizeAngle((dt.second() + dt.millisecond() / 1000) * 6);
}

/** Compute minute hand angle from a Date, respecting timezone */
export function minuteAngleFromDate(d: Date | null | undefined, tz?: string): number {
  if (!d) {
    return 0;
  }
  const dt = tz && tz !== '' ? dayjs(d).tz(tz) : dayjs(d);
  return normalizeAngle(dt.minute() * 6);
}

/** Compute hour hand angle from a Date, respecting timezone */
export function hourAngleFromDate(d: Date | null | undefined, tz?: string): number {
  if (!d) {
    return 0;
  }
  const dt = tz && tz !== '' ? dayjs(d).tz(tz) : dayjs(d);
  return normalizeAngle((dt.hour() % 12) * 30 + dt.minute() * 0.5);
}

/** Build an SVG sector path from center to arc */
export function describeSectorPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  direction: 'clockwise' | 'counterClockwise'
): string {
  const start = normalizeAngle(startDeg);
  const end = normalizeAngle(endDeg);

  let delta = 0;
  if (direction === 'clockwise') {
    delta = end - start;
    if (delta < 0) {
      delta += 360;
    }
  } else {
    delta = start - end;
    if (delta < 0) {
      delta += 360;
    }
  }

  const largeArc = delta >= 180 ? 1 : 0;
  const sweep = direction === 'clockwise' ? 1 : 0;

  const aStart = (start * Math.PI) / 180;
  const aEnd = (end * Math.PI) / 180;
  const x1 = cx + r * Math.sin(aStart);
  const y1 = cy - r * Math.cos(aStart);
  const x2 = cx + r * Math.sin(aEnd);
  const y2 = cy - r * Math.cos(aEnd);

  return `M ${fmt(cx)} ${fmt(cy)} L ${fmt(x1)} ${fmt(y1)} A ${fmt(r)} ${fmt(r)} 0 ${largeArc} ${sweep} ${fmt(x2)} ${fmt(y2)} Z`;
}

// --- Geometry interface ---

export interface TickPosition {
  x: number;
  y: number;
  angle: number;
  transformOrigin: string;
  /** 'rotation' = circular CSS rotate pattern, 'absolute' = positioned at x,y with angle rotation */
  positioning: 'rotation' | 'absolute';
}

export interface NumberPosition {
  x: number;
  y: number;
}

export interface HandAnchor {
  x: number;
  y: number;
}

export interface ClockGeometry {
  /** The width and height of the clock container */
  readonly width: number;
  readonly height: number;
  /** Center coordinates */
  readonly centerX: number;
  readonly centerY: number;
  /** CSS clip-path for the clock face shape */
  clipPath: () => string | undefined;
  /** CSS border-radius for the clock face shape */
  borderRadius: () => string;
  /** Position of a tick mark (hour or minute) */
  tickPosition: (index: number, total: number, tickOffset: number) => TickPosition;
  /** Position of an hour number */
  numberPosition: (hourIndex: number, numberRadius: number) => NumberPosition;
  /** Hand anchor point (where hands rotate from) */
  handAnchor: () => HandAnchor;
  /** Hand length given a ratio (0-1) relative to the "radius" */
  handLength: (ratio: number) => number;
  /** SVG sector path for arcs */
  sectorPath: (
    startDeg: number,
    endDeg: number,
    radius: number,
    direction: 'clockwise' | 'counterClockwise'
  ) => string;
}

// --- Circular geometry (default) ---

export class CircularGeometry implements ClockGeometry {
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  private readonly radius: number;

  constructor(size: number) {
    this.width = size;
    this.height = size;
    this.centerX = Math.round(size / 2);
    this.centerY = Math.round(size / 2);
    this.radius = Math.round(size / 2);
  }

  clipPath(): string | undefined {
    return undefined; // circle uses border-radius, no clip-path needed
  }

  borderRadius(): string {
    return '50%';
  }

  tickPosition(index: number, total: number, tickOffset: number): TickPosition {
    const angleDeg = (360 / total) * index;
    return {
      x: 0, // positioned via CSS left: 50% + transform
      y: tickOffset,
      angle: angleDeg,
      transformOrigin: `50% ${this.radius - tickOffset}px`,
      positioning: 'rotation',
    };
  }

  numberPosition(hourIndex: number, numberRadius: number): NumberPosition {
    const angle = (hourIndex * 30 - 90) * (Math.PI / 180);
    return {
      x: Math.round(this.centerX + Math.cos(angle) * numberRadius),
      y: Math.round(this.centerY + Math.sin(angle) * numberRadius),
    };
  }

  handAnchor(): HandAnchor {
    return { x: this.centerX, y: this.centerY };
  }

  handLength(ratio: number): number {
    return Math.round(this.radius * ratio);
  }

  sectorPath(
    startDeg: number,
    endDeg: number,
    radius: number,
    direction: 'clockwise' | 'counterClockwise'
  ): string {
    return describeSectorPath(this.centerX, this.centerY, radius, startDeg, endDeg, direction);
  }
}

// --- Rounded-rectangle geometry ---
// Distributes ticks and numbers along the perimeter of the rounded rectangle
// using ray-casting from center. This produces the Apple Watch effect where
// numbers follow the rectangular edges rather than a circular path.

export class RoundedRectGeometry implements ClockGeometry {
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  private readonly borderRadiusValue: number;
  private readonly radius: number; // effective radius for hands (half shorter side)
  private readonly hw: number; // half width
  private readonly hh: number; // half height

  constructor(width: number, height: number, borderRadius: number) {
    this.width = width;
    this.height = height;
    this.centerX = Math.round(width / 2);
    this.centerY = Math.round(height / 2);
    this.borderRadiusValue = Math.min(borderRadius, Math.min(width, height) / 2);
    this.radius = Math.round(Math.min(width, height) / 2);
    this.hw = width / 2;
    this.hh = height / 2;
  }

  clipPath(): string {
    return `inset(0 round ${this.borderRadiusValue}px)`;
  }

  borderRadius(): string {
    return `${this.borderRadiusValue}px`;
  }

  tickPosition(index: number, total: number, tickOffset: number): TickPosition {
    // Clock angle: 0=12 o'clock, 90=3 o'clock, etc.
    const clockDeg = (360 / total) * index;
    // Convert to math angle (0=right, counter-clockwise) for ray casting
    const mathRad = ((clockDeg - 90) * Math.PI) / 180;

    const dist = this.distanceToEdge(mathRad);
    // Position the tick at the edge, inset by tickOffset
    const r = dist - tickOffset;
    const x = this.centerX + Math.cos(mathRad) * r;
    const y = this.centerY + Math.sin(mathRad) * r;

    return {
      x: Math.round(x),
      y: Math.round(y),
      angle: clockDeg, // rotation so tick points inward
      transformOrigin: 'center center',
      positioning: 'absolute',
    };
  }

  numberPosition(hourIndex: number, numberRadius: number): NumberPosition {
    const mathRad = ((hourIndex * 30 - 90) * Math.PI) / 180;
    const dist = this.distanceToEdge(mathRad);
    // Scale: numberRadius is relative to the circular radius, map to edge distance
    const maxRadius = this.radius;
    const scaledR = (numberRadius / maxRadius) * dist * 0.92; // 0.92 keeps inside padding

    return {
      x: Math.round(this.centerX + Math.cos(mathRad) * scaledR),
      y: Math.round(this.centerY + Math.sin(mathRad) * scaledR),
    };
  }

  handAnchor(): HandAnchor {
    return { x: this.centerX, y: this.centerY };
  }

  handLength(ratio: number): number {
    return Math.round(this.radius * ratio);
  }

  sectorPath(
    startDeg: number,
    endDeg: number,
    radius: number,
    direction: 'clockwise' | 'counterClockwise'
  ): string {
    return describeSectorPath(this.centerX, this.centerY, radius, startDeg, endDeg, direction);
  }

  /**
   * Distance from center to the edge of the rounded rectangle at a given math angle.
   * Accounts for the corner arcs: if the ray hits a corner region, it intersects
   * the quarter-circle arc instead of the straight edge.
   */
  private distanceToEdge(mathRad: number): number {
    const cos = Math.cos(mathRad);
    const sin = Math.sin(mathRad);
    const br = this.borderRadiusValue;

    // Distance to the plain rectangle edge
    let rectDist: number;
    if (Math.abs(cos) < 1e-10) {
      rectDist = this.hh / Math.abs(sin);
    } else if (Math.abs(sin) < 1e-10) {
      rectDist = this.hw / Math.abs(cos);
    } else {
      rectDist = Math.min(this.hw / Math.abs(cos), this.hh / Math.abs(sin));
    }

    if (br < 1) {
      return rectDist;
    }

    // Check if the hit point falls in a corner region
    const px = cos * rectDist;
    const py = sin * rectDist;

    const inCornerX = Math.abs(px) > this.hw - br;
    const inCornerY = Math.abs(py) > this.hh - br;

    if (!inCornerX || !inCornerY) {
      // On a straight segment, rect distance is correct
      return rectDist;
    }

    // Ray hits a corner region — intersect with the corner circle
    const cx = (px > 0 ? 1 : -1) * (this.hw - br);
    const cy = (py > 0 ? 1 : -1) * (this.hh - br);

    // Solve: (t*cos - cx)^2 + (t*sin - cy)^2 = br^2
    // t^2 - 2t*(cos*cx + sin*cy) + (cx^2 + cy^2 - br^2) = 0
    const b = -(cos * cx + sin * cy);
    const c = cx * cx + cy * cy - br * br;
    const discriminant = b * b - c;

    if (discriminant < 0) {
      return rectDist; // fallback
    }

    const sqrtD = Math.sqrt(discriminant);
    const t = -b + sqrtD; // we want the farther intersection (outer edge)

    return t > 0 ? t : rectDist;
  }
}

/** Create the appropriate geometry for the given shape */
export function createGeometry(
  size: number,
  shape: 'circle' | 'rounded-rect' = 'circle',
  options?: { aspectRatio?: number; borderRadius?: number }
): ClockGeometry {
  if (shape === 'rounded-rect') {
    const aspectRatio = options?.aspectRatio ?? 1;
    const width = size;
    const height = Math.round(size * aspectRatio);
    // Default border radius: 20% of the shorter side (Apple Watch-like)
    const borderRadius = options?.borderRadius ?? Math.round(Math.min(width, height) * 0.2);
    return new RoundedRectGeometry(width, height, borderRadius);
  }
  return new CircularGeometry(size);
}
