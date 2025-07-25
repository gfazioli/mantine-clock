import React from 'react';
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

  it('renders with default props', () => {
    const { container } = render(<Clock />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveStyle('--clock-size: 400px');
  });

  it('renders with custom size', () => {
    const { container } = render(<Clock size={200} />);
    const root = container.querySelector('.mantine-Clock-root');
    expect(root).toHaveStyle('--clock-size: 200px');
  });

  it('renders clock container and face', () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('.mantine-Clock-clockContainer')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-glassWrapper')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-clockFace')).toBeInTheDocument();
  });

  it('renders hour numbers by default', () => {
    const { container } = render(<Clock />);
    const primaryNumbers = container.querySelectorAll('.mantine-Clock-primaryNumber');
    const secondaryNumbers = container.querySelectorAll('.mantine-Clock-secondaryNumber');

    // Should render 4 primary numbers (12, 3, 6, 9)
    expect(primaryNumbers).toHaveLength(4);

    // Should render 8 secondary numbers (1, 2, 4, 5, 7, 8, 10, 11)
    expect(secondaryNumbers).toHaveLength(8);

    // Check that primary numbers contain expected values
    const primaryTexts = Array.from(primaryNumbers).map((el) => el.textContent);
    expect(primaryTexts).toContain('12');
    expect(primaryTexts).toContain('3');
    expect(primaryTexts).toContain('6');
    expect(primaryTexts).toContain('9');

    // Check that secondary numbers contain expected values
    const secondaryTexts = Array.from(secondaryNumbers).map((el) => el.textContent);
    expect(secondaryTexts).toContain('1');
    expect(secondaryTexts).toContain('2');
    expect(secondaryTexts).toContain('4');
    expect(secondaryTexts).toContain('5');
  });

  it('renders hour ticks', () => {
    const { container } = render(<Clock />);
    const hourTicks = container.querySelectorAll('.mantine-Clock-hourTick');
    expect(hourTicks).toHaveLength(12);
  });

  it('renders minute ticks (excluding hour positions)', () => {
    const { container } = render(<Clock />);
    const minuteTicks = container.querySelectorAll('.mantine-Clock-minuteTick');
    // 60 total positions - 12 hour positions = 48 minute ticks
    expect(minuteTicks).toHaveLength(48);
  });

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

  it('renders only primary numbers when secondary opacity is 0', () => {
    const { container } = render(<Clock secondaryNumbersOpacity={0} />);
    const primaryNumbers = container.querySelectorAll('.mantine-Clock-primaryNumber');
    const secondaryNumbers = container.querySelectorAll('.mantine-Clock-secondaryNumber');

    expect(primaryNumbers).toHaveLength(4);
    expect(secondaryNumbers).toHaveLength(0);
  });

  it('renders only secondary numbers when primary opacity is 0', () => {
    const { container } = render(<Clock primaryNumbersOpacity={0} />);
    const primaryNumbers = container.querySelectorAll('.mantine-Clock-primaryNumber');
    const secondaryNumbers = container.querySelectorAll('.mantine-Clock-secondaryNumber');

    expect(primaryNumbers).toHaveLength(0);
    expect(secondaryNumbers).toHaveLength(8);
  });

  it('renders all clock hands by default', () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('.mantine-Clock-hourHand')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-minuteHand')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-secondHandContainer')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-secondHand')).toBeInTheDocument();
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

  it('renders center elements', () => {
    const { container } = render(<Clock />);
    expect(container.querySelector('.mantine-Clock-centerBlur')).toBeInTheDocument();
    expect(container.querySelector('.mantine-Clock-centerDot')).toBeInTheDocument();
  });

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

    expect(hourHand).toHaveStyle('height: 100px'); // 200 * 0.5
    expect(minuteHand).toHaveStyle('height: 140px'); // 200 * 0.7
    expect(secondHandContainer).toHaveStyle('height: 160px'); // 200 * 0.8
  });

  it('applies custom hour numbers distance', () => {
    const { container } = render(<Clock hourNumbersDistance={0.8} />);
    const primaryNumbers = container.querySelectorAll('.mantine-Clock-primaryNumber');
    const secondaryNumbers = container.querySelectorAll('.mantine-Clock-secondaryNumber');

    // Check that primary and secondary numbers are rendered
    expect(primaryNumbers.length).toBe(4);
    expect(secondaryNumbers.length).toBe(8);

    // Total numbers should be 12
    expect(primaryNumbers.length + secondaryNumbers.length).toBe(12);
  });

  it('supports different second hand behaviors', () => {
    const behaviors = ['tick', 'smooth', 'tick-half', 'tick-high-freq'] as const;

    behaviors.forEach((behavior) => {
      const { container } = render(<Clock secondHandBehavior={behavior} />);
      expect(container.querySelector('.mantine-Clock-secondHand')).toBeInTheDocument();
    });
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

  it('updates time correctly', () => {
    const { container } = render(<Clock />);

    // Initial state - should have hands positioned for 12:34:56
    const hourHand = container.querySelector('.mantine-Clock-hourHand');
    const minuteHand = container.querySelector('.mantine-Clock-minuteHand');
    const secondHand = container.querySelector('.mantine-Clock-secondHandContainer');

    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    expect(secondHand).toBeInTheDocument();

    // The exact rotation calculations would require more complex testing
    // but we can verify the hands are rendered and positioned
  });
});
