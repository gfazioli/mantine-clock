import React from 'react';
import { act } from '@testing-library/react';
import { render } from '@mantine-tests/core';
import { Clock } from './Clock';
import { ClockDigital } from './ClockDigital';

describe('ClockDigital', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T14:30:45.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    const { container } = render(<ClockDigital />);
    const root = container.querySelector('.mantine-ClockDigital-root');
    expect(root).toBeInTheDocument();
  });

  it('renders hours, separator, and minutes', () => {
    const { container } = render(<ClockDigital />);
    expect(container.querySelector('.mantine-ClockDigital-hours')).toBeInTheDocument();
    expect(container.querySelector('.mantine-ClockDigital-separator')).toBeInTheDocument();
    expect(container.querySelector('.mantine-ClockDigital-minutes')).toBeInTheDocument();
  });

  it('renders seconds by default', () => {
    const { container } = render(<ClockDigital />);
    expect(container.querySelector('.mantine-ClockDigital-seconds')).toBeInTheDocument();
  });

  it('hides seconds when showSeconds is false', () => {
    const { container } = render(<ClockDigital showSeconds={false} />);
    expect(container.querySelector('.mantine-ClockDigital-seconds')).not.toBeInTheDocument();
  });

  it('shows AM/PM in 12-hour mode', () => {
    const { container } = render(<ClockDigital use24Hours={false} showAmPm />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    const amPm = container.querySelector('.mantine-ClockDigital-amPm');
    expect(amPm).toBeInTheDocument();
  });

  it('shows date when showDate is true', () => {
    const { container } = render(<ClockDigital showDate />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(container.querySelector('.mantine-ClockDigital-date')).toBeInTheDocument();
  });

  it('uses custom separator', () => {
    const { container } = render(<ClockDigital separator="-" />);
    const separators = container.querySelectorAll('.mantine-ClockDigital-separator');
    expect(separators[0]?.textContent).toBe('-');
  });

  it('has role="timer"', () => {
    const { container } = render(<ClockDigital />);
    const root = container.querySelector('.mantine-ClockDigital-root');
    expect(root).toHaveAttribute('role', 'timer');
  });

  it('is accessible as Clock.Digital compound', () => {
    const { container } = render(<Clock.Digital />);
    expect(container.querySelector('.mantine-ClockDigital-root')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ClockDigital ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
