import React from 'react';
import { act } from '@testing-library/react';
import { render } from '@mantine-tests/core';
import { Clock } from './Clock';

describe('Clock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:34:56.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // --- Basic rendering ---

  it('renders with default props', () => {
    const { container } = render(<Clock />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveStyle('--clock-size: 400px');
  });

  it('renders with custom size (number)', () => {
    const { container } = render(<Clock size={200} />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveStyle('--clock-size: 200px');
  });

  it('renders with named size (sm)', () => {
    const { container } = render(<Clock size="sm" />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveStyle('--clock-size: 200px');
  });

  it('renders with named size (md)', () => {
    const { container } = render(<Clock size="md" />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveStyle('--clock-size: 400px');
  });

  it('renders with named size (lg)', () => {
    const { container } = render(<Clock size="lg" />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveStyle('--clock-size: 480px');
  });

  // --- Ref forwarding ---

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Clock ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.toString()).toContain('mantine-Clock-root');
  });

  // --- Static mode ---

  it('renders static time when running={false}', () => {
    const { container } = render(<Clock running={false} />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toBeInTheDocument();
    // Should still render clock structure
    expect(container.querySelector('.mantine-Clock-clockContainer')).toBeInTheDocument();
  });

  it('renders specific value when value prop is set', () => {
    const { container } = render(<Clock running={false} value="10:30:00" />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toBeInTheDocument();
  });

  // --- Clock structure ---

  it('renders clock container, glass wrapper, and clock face', () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('.mantine-Clock-clockContainer')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-glassWrapper')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-clockFace')).toBeInTheDocument();
  });

  it('renders 12 hour ticks by default', () => {
    const { container } = render(<Clock />);
    const hourTicks = container.querySelectorAll('.mantine-Clock-hourTick');
    expect(hourTicks).toHaveLength(12);
  });

  it('renders 48 minute ticks by default', () => {
    const { container } = render(<Clock />);
    const minuteTicks = container.querySelectorAll('.mantine-Clock-minuteTick');
    // 60 total positions - 12 hour positions = 48 minute ticks
    expect(minuteTicks).toHaveLength(48);
  });

  it('renders 4 primary numbers (12, 3, 6, 9)', () => {
    const { container } = render(<Clock />);
    const primaryNumbers = container.querySelectorAll('.mantine-Clock-primaryNumber');
    expect(primaryNumbers).toHaveLength(4);

    const texts = Array.from(primaryNumbers).map((el) => el.textContent);
    expect(texts).toContain('12');
    expect(texts).toContain('3');
    expect(texts).toContain('6');
    expect(texts).toContain('9');
  });

  it('renders 8 secondary numbers', () => {
    const { container } = render(<Clock />);
    const secondaryNumbers = container.querySelectorAll('.mantine-Clock-secondaryNumber');
    expect(secondaryNumbers).toHaveLength(8);

    const texts = Array.from(secondaryNumbers).map((el) => el.textContent);
    expect(texts).toContain('1');
    expect(texts).toContain('2');
    expect(texts).toContain('4');
    expect(texts).toContain('5');
    expect(texts).toContain('7');
    expect(texts).toContain('8');
    expect(texts).toContain('10');
    expect(texts).toContain('11');
  });

  it('renders all clock hands by default', () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('.mantine-Clock-hourHand')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-minuteHand')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-secondHandContainer')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-secondHand')).toBeInTheDocument();
  });

  it('renders center blur and center dot', () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('.mantine-Clock-centerBlur')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-centerDot')).toBeInTheDocument();
  });

  // --- Opacity = 0 hides elements ---

  it('hides hour ticks when hourTicksOpacity is 0', () => {
    const { container } = render(<Clock hourTicksOpacity={0} />);
    const hourTicks = container.querySelectorAll('.mantine-Clock-hourTick');
    expect(hourTicks).toHaveLength(0);
  });

  it('hides minute ticks when minuteTicksOpacity is 0', () => {
    const { container } = render(<Clock minuteTicksOpacity={0} />);
    const minuteTicks = container.querySelectorAll('.mantine-Clock-minuteTick');
    expect(minuteTicks).toHaveLength(0);
  });

  it('hides primary numbers when primaryNumbersOpacity is 0', () => {
    const { container } = render(<Clock primaryNumbersOpacity={0} />);
    const primaryNumbers = container.querySelectorAll('.mantine-Clock-primaryNumber');
    expect(primaryNumbers).toHaveLength(0);
  });

  it('hides secondary numbers when secondaryNumbersOpacity is 0', () => {
    const { container } = render(<Clock secondaryNumbersOpacity={0} />);
    const secondaryNumbers = container.querySelectorAll('.mantine-Clock-secondaryNumber');
    expect(secondaryNumbers).toHaveLength(0);
  });

  it('hides hour hand when hourHandOpacity is 0', () => {
    const { container } = render(<Clock hourHandOpacity={0} />);
    expect(container.querySelector('.mantine-Clock-hourHand')).not.toBeInTheDocument();
  });

  it('hides minute hand when minuteHandOpacity is 0', () => {
    const { container } = render(<Clock minuteHandOpacity={0} />);
    expect(container.querySelector('.mantine-Clock-minuteHand')).not.toBeInTheDocument();
  });

  it('hides second hand when secondHandOpacity is 0', () => {
    const { container } = render(<Clock secondHandOpacity={0} />);
    expect(container.querySelector('.mantine-Clock-secondHandContainer')).not.toBeInTheDocument();
  });

  // --- Custom props ---

  it('applies custom hand sizes', () => {
    const { container } = render(
      <Clock hourHandSize={0.02} minuteHandSize={0.015} secondHandSize={0.008} />
    );

    const hourHand = container.querySelector('.mantine-Clock-hourHand');
    const minuteHand = container.querySelector('.mantine-Clock-minuteHand');
    const secondHand = container.querySelector('.mantine-Clock-secondHand');

    expect(hourHand).toHaveStyle('width: 8px'); // 400 * 0.02
    expect(minuteHand).toHaveStyle('width: 6px'); // 400 * 0.015
    expect(secondHand?.parentElement).toHaveStyle('width: 3.2px'); // 400 * 0.008
  });

  it('applies custom hand lengths', () => {
    const { container } = render(
      <Clock hourHandLength={0.5} minuteHandLength={0.7} secondHandLength={0.8} />
    );

    const hourHand = container.querySelector('.mantine-Clock-hourHand');
    const minuteHand = container.querySelector('.mantine-Clock-minuteHand');
    const secondHandContainer = container.querySelector('.mantine-Clock-secondHandContainer');

    // clockRadius = 400/2 = 200; 200*0.5=100, 200*0.7=140, 200*0.8=160
    expect(hourHand).toHaveStyle('height: 100px');
    expect(minuteHand).toHaveStyle('height: 140px');
    expect(secondHandContainer).toHaveStyle('height: 160px');
  });

  it('applies CSS variables correctly', () => {
    const { container } = render(
      <Clock
        color="red"
        hourTicksColor="blue"
        hourTicksOpacity={0.8}
        minuteTicksColor="green"
        minuteTicksOpacity={0.6}
        primaryNumbersColor="purple"
        primaryNumbersOpacity={0.9}
        secondaryNumbersColor="orange"
        secondaryNumbersOpacity={0.7}
        secondHandColor="yellow"
      />
    );

    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveStyle('--clock-hour-ticks-opacity: 0.8');
    expect(root).toHaveStyle('--clock-minute-ticks-opacity: 0.6');
    expect(root).toHaveStyle('--clock-primary-numbers-opacity: 0.9');
    expect(root).toHaveStyle('--clock-secondary-numbers-opacity: 0.7');
  });

  it('forwards additional props to root element', () => {
    const { container } = render(
      <Clock
        data-testid="custom-clock"
        className="custom-class"
        style={{ border: '1px solid red' }}
      />
    );

    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveAttribute('data-testid', 'custom-clock');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveStyle('border: 1px solid red');
  });

  // --- Second hand behaviors ---

  it('supports different second hand behaviors', () => {
    const behaviors = ['tick', 'smooth', 'tick-half', 'tick-high-freq'] as const;

    behaviors.forEach((behavior) => {
      const { container } = render(<Clock secondHandBehavior={behavior} />);
      expect(container.querySelector('.mantine-Clock-secondHand')).toBeInTheDocument();
    });
  });

  // --- Arcs ---

  it('renders seconds arc when withSecondsArc is true', () => {
    const { container } = render(<Clock withSecondsArc />);
    const svg = container.querySelector('.mantine-Clock-arcsLayer');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll('path').length).toBeGreaterThanOrEqual(1);
  });

  it('does not render arcs by default', () => {
    const { container } = render(<Clock />);
    const svg = container.querySelector('.mantine-Clock-arcsLayer');
    expect(svg).not.toBeInTheDocument();
  });

  // --- Accessibility ---

  it('has role="img" on root element', () => {
    const { container } = render(<Clock />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveAttribute('role', 'img');
  });

  it('has default aria-label with time', () => {
    const { container } = render(<Clock />);
    const root = container.querySelector('.mantine-Clock-root');
    const ariaLabel = root?.getAttribute('aria-label') || '';
    // After mount, the default label should contain "Clock showing" with time
    // Before mount (SSR), it is just "Clock"
    expect(ariaLabel).toMatch(/^Clock/);
  });

  it('uses custom ariaLabel when provided', () => {
    const { container } = render(<Clock ariaLabel="My custom clock" />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveAttribute('aria-label', 'My custom clock');
  });

  // --- Cleanup ---

  it('cleans up intervals on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<Clock />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
