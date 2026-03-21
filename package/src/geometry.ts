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

export class RoundedRectGeometry implements ClockGeometry {
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  private readonly borderRadiusValue: number;

  constructor(width: number, height: number, borderRadius: number) {
    this.width = width;
    this.height = height;
    this.centerX = Math.round(width / 2);
    this.centerY = Math.round(height / 2);
    // Clamp border radius to half the shorter side
    this.borderRadiusValue = Math.min(borderRadius, Math.min(width, height) / 2);
  }

  clipPath(): string {
    return `inset(0 round ${this.borderRadiusValue}px)`;
  }

  borderRadius(): string {
    return `${this.borderRadiusValue}px`;
  }

  // For tick and number positioning, we distribute them along an elliptical path
  // that fits inside the rounded rectangle, inset from the edges.

  tickPosition(index: number, total: number, tickOffset: number): TickPosition {
    // Use the same angular approach as circular but with the effective radius
    // adjusted for the rectangular shape. The "radius" varies by angle.
    const angleDeg = (360 / total) * index;
    const angleRad = (angleDeg - 90) * (Math.PI / 180); // -90 to start from top

    // For a rounded rect, we compute the distance from center to the edge at this angle
    const edgeDistance = this.distanceToEdge(angleRad);
    const tickRadius = edgeDistance - tickOffset;

    // Position using polar coordinates from center
    const x = this.centerX + Math.cos(angleRad) * tickRadius;
    const y = this.centerY + Math.sin(angleRad) * tickRadius;

    return {
      x: Math.round(x),
      y: Math.round(y),
      angle: angleDeg,
      // For rounded rect, ticks use absolute positioning + rotation
      transformOrigin: 'center center',
    };
  }

  numberPosition(hourIndex: number, numberRadius: number): NumberPosition {
    const angle = (hourIndex * 30 - 90) * (Math.PI / 180);
    // Scale the number radius based on the edge distance at this angle
    const edgeDistance = this.distanceToEdge(angle);
    const maxRadius = Math.min(this.width, this.height) / 2;
    const scaledRadius = (numberRadius / maxRadius) * edgeDistance * 0.92; // 0.92 to keep inside

    return {
      x: Math.round(this.centerX + Math.cos(angle) * scaledRadius),
      y: Math.round(this.centerY + Math.sin(angle) * scaledRadius),
    };
  }

  handAnchor(): HandAnchor {
    return { x: this.centerX, y: this.centerY };
  }

  handLength(ratio: number): number {
    // Use the shorter dimension as the reference
    const minHalf = Math.min(this.width, this.height) / 2;
    return Math.round(minHalf * ratio);
  }

  sectorPath(
    startDeg: number,
    endDeg: number,
    radius: number,
    direction: 'clockwise' | 'counterClockwise'
  ): string {
    // For rounded rect, still use circular sector paths from center
    // (the clip-path on the container will clip to the rounded rect shape)
    return describeSectorPath(this.centerX, this.centerY, radius, startDeg, endDeg, direction);
  }

  /** Calculate distance from center to the edge of the rounded rect at a given angle */
  private distanceToEdge(angleRad: number): number {
    const hw = this.width / 2;
    const hh = this.height / 2;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    // Distance to axis-aligned rectangle edge
    let dist: number;
    if (Math.abs(cos) < 1e-10) {
      dist = hh / Math.abs(sin);
    } else if (Math.abs(sin) < 1e-10) {
      dist = hw / Math.abs(cos);
    } else {
      const dx = hw / Math.abs(cos);
      const dy = hh / Math.abs(sin);
      dist = Math.min(dx, dy);
    }

    return dist;
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
