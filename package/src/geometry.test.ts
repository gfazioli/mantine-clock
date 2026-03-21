import {
  CircularGeometry,
  createGeometry,
  describeSectorPath,
  normalizeAngle,
  RoundedRectGeometry,
} from './geometry';

describe('geometry', () => {
  describe('normalizeAngle', () => {
    it('normalizes positive angles', () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(360)).toBe(0);
      expect(normalizeAngle(450)).toBe(90);
    });
    it('normalizes negative angles', () => {
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-360)).toBe(0);
    });
  });

  describe('CircularGeometry', () => {
    const geo = new CircularGeometry(400);

    it('has correct dimensions', () => {
      expect(geo.width).toBe(400);
      expect(geo.height).toBe(400);
      expect(geo.centerX).toBe(200);
      expect(geo.centerY).toBe(200);
    });

    it('returns circular border radius', () => {
      expect(geo.borderRadius()).toBe('50%');
    });

    it('returns undefined clip path', () => {
      expect(geo.clipPath()).toBeUndefined();
    });

    it('calculates hand length from ratio', () => {
      expect(geo.handLength(0.5)).toBe(100); // 200 * 0.5
      expect(geo.handLength(1)).toBe(200);
    });

    it('returns center as hand anchor', () => {
      expect(geo.handAnchor()).toEqual({ x: 200, y: 200 });
    });

    it('calculates tick positions', () => {
      const pos = geo.tickPosition(0, 12, 10);
      expect(pos.angle).toBe(0);
      expect(pos.y).toBe(10);
    });

    it('calculates number positions', () => {
      // 12 o'clock (index 0): should be at top center
      const pos12 = geo.numberPosition(0, 150);
      expect(pos12.x).toBe(200); // center
      expect(pos12.y).toBeLessThan(200); // above center
    });

    it('generates sector path', () => {
      const path = geo.sectorPath(0, 90, 100, 'clockwise');
      expect(path).toContain('M');
      expect(path).toContain('A');
      expect(path).toContain('Z');
    });
  });

  describe('RoundedRectGeometry', () => {
    const geo = new RoundedRectGeometry(400, 480, 40);

    it('has correct dimensions', () => {
      expect(geo.width).toBe(400);
      expect(geo.height).toBe(480);
      expect(geo.centerX).toBe(200);
      expect(geo.centerY).toBe(240);
    });

    it('returns rounded border radius', () => {
      expect(geo.borderRadius()).toBe('40px');
    });

    it('returns clip path', () => {
      expect(geo.clipPath()).toBe('inset(0 round 40px)');
    });

    it('clamps border radius to half shorter side', () => {
      const geo2 = new RoundedRectGeometry(100, 200, 999);
      expect(geo2.borderRadius()).toBe('50px'); // 100/2
    });

    it('calculates hand length from shorter dimension', () => {
      // min(400,480)/2 = 200, * 0.5 = 100
      expect(geo.handLength(0.5)).toBe(100);
    });

    it('uses absolute tick positioning along perimeter', () => {
      const pos = geo.tickPosition(0, 12, 10);
      expect(pos.angle).toBe(0); // 12 o'clock
      expect(pos.positioning).toBe('absolute');
      // 12 o'clock tick should be at top center, inset by tickOffset
      expect(pos.x).toBe(200); // centerX
      expect(pos.y).toBeLessThan(240); // above centerY
    });

    it("positions 3 o'clock tick at right edge", () => {
      const pos = geo.tickPosition(3, 12, 10);
      expect(pos.angle).toBe(90);
      expect(pos.x).toBeGreaterThan(200); // right of center
    });

    it('positions numbers along perimeter', () => {
      const pos12 = geo.numberPosition(0, 150);
      expect(pos12.x).toBe(200); // 12 at top center
      expect(pos12.y).toBeLessThan(240); // above centerY

      const pos3 = geo.numberPosition(3, 150);
      expect(pos3.x).toBeGreaterThan(200); // 3 at right
      expect(pos3.y).toBeGreaterThanOrEqual(230); // near centerY (240)
      expect(pos3.y).toBeLessThanOrEqual(250);
    });
  });

  describe('createGeometry', () => {
    it('creates circular geometry by default', () => {
      const geo = createGeometry(400);
      expect(geo).toBeInstanceOf(CircularGeometry);
    });

    it('creates rounded-rect geometry', () => {
      const geo = createGeometry(400, 'rounded-rect');
      expect(geo).toBeInstanceOf(RoundedRectGeometry);
    });

    it('passes options to rounded-rect', () => {
      const geo = createGeometry(400, 'rounded-rect', { aspectRatio: 1.2, borderRadius: 30 });
      expect(geo.width).toBe(400);
      expect(geo.height).toBe(480); // 400 * 1.2
      expect(geo.borderRadius()).toBe('30px');
    });
  });

  describe('describeSectorPath', () => {
    it('returns valid SVG path', () => {
      const path = describeSectorPath(200, 200, 100, 0, 90, 'clockwise');
      expect(path).toMatch(/^M .+ L .+ A .+ Z$/);
    });
  });
});
