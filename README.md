# Mantine Clock Component

<img alt="Mantine Clock" src="https://github.com/gfazioli/mantine-clock/blob/master/logo.jpeg" />

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-clock?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-clock)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-clock?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-clock)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-clock?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-clock)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-clock?style=for-the-badge)


---

[<kbd> <br/> ❤️ If this component has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.

[Mantine Clock](https://gfazioli.github.io/mantine-clock/) delivers both an analog Clock component and time-management hooks tailored for React applications. 

The Clock supports live ticking or static display via a value prop, multiple second-hand behaviors (smooth, tick, half‑tick), and rich styling through classNames and the Styles API—including control over ticks, numbers, hands, center dot, and themed appearances like a “Neon Cyber Clock.” It further enables visual sector arcs that dynamically align to current seconds, minutes, and hours hand positions, with precise start rules, direction, colors, and opacity.

> [!note]
>
> → [Demo and Documentation](https://gfazioli.github.io/mantine-clock/) → [Youtube Video](https://www.youtube.com/playlist?list=PL85tTROKkZrWyqCcmNCdWajpx05-cTal4) → [More Mantine Components](https://mantine-extensions.vercel.app/)


## Installation

```sh
npm install @gfazioli/mantine-clock
```
or 

```sh
yarn add @gfazioli/mantine-clock
```

After installation import package styles at the root of your application:

```tsx
import '@gfazioli/mantine-clock/styles.css';
```

## Usage

The Mantine Clock library provides powerful components and hooks for time management and visualization in React applications using Mantine.

### Clock Component

Create analog clocks with real-time updates or static time display:

```tsx
import { Clock } from '@gfazioli/mantine-clock';

// Real-time clock
function LiveClock() {
  return <Clock />;
}

// Static clock showing specific time
function StaticClock() {
  return <Clock value={new Date('2023-12-25T15:30:00')} running={false} />;
}

// Customized clock with timezone
function WorldClock() {
  return (
    <Clock 
      timezone="America/New_York"
      size={200}
      hourHandColor="blue"
      minuteHandColor="cyan"
      secondHandColor="red"
    />
  );
}
```

### useClock Hook

Get real-time time data with flexible formatting:

```tsx
import { useClock } from '@gfazioli/mantine-clock';

function DigitalClock() {
  const { hours, minutes, seconds, amPm, isRunning } = useClock({
    timezone: 'UTC',
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true
  });

  return (
    <div>
      {hours}:{minutes}:{seconds} {amPm}
    </div>
  );
}
```

### useClockCountDown Hook

Create countdown timers with target dates or durations:

```tsx
import { useClockCountDown } from '@gfazioli/mantine-clock';

// Countdown to specific date
function EventCountdown() {
  const { day, hours, minutes, seconds } = useClockCountDown({
    targetDate: new Date('2024-12-31T23:59:59'),
    onCountDownCompleted: () => alert('Happy New Year!')
  });

  return (
    <div>
      Time remaining: {day}d {hours}h {minutes}m {seconds}s
    </div>
  );
}

// Countdown from duration
function TimerCountdown() {
  const { minutes, seconds, isRunning } = useClockCountDown({
    minutes: 25, // 25-minute Pomodoro timer
    onCountDownCompleted: () => console.log('Break time!')
  });

  return (
    <div>
      Pomodoro: {minutes}:{seconds}
    </div>
  );
}
```

### Styling and Theming

The library integrates seamlessly with Mantine's theming system:

```tsx
import '@gfazioli/mantine-clock/styles.css';
// or with CSS layers
import '@gfazioli/mantine-clock/styles.layer.css';

// Custom styled clock with available CSS variables
function ThemedClock() {
  return (
    <Clock 
      style={{
        '--clock-color': 'var(--mantine-color-blue-1)',
        '--clock-hour-ticks-color': 'var(--mantine-color-blue-6)',
        '--clock-minute-ticks-color': 'var(--mantine-color-blue-4)',
        '--clock-primary-numbers-color': 'var(--mantine-color-blue-9)',
        '--clock-secondary-numbers-color': 'var(--mantine-color-blue-7)',
        '--clock-hour-hand-color': 'var(--mantine-color-blue-8)',
        '--clock-minute-hand-color': 'var(--mantine-color-blue-6)',
        '--clock-second-hand-color': 'var(--mantine-color-red-6)'
      }}
      className="my-custom-clock"
    />
  );
}
```

### Advanced Examples

```tsx
// Multi-timezone dashboard
function WorldClockDashboard() {
  const timezones = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' }
  ];

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {timezones.map(({ name, tz }) => (
        <div key={tz}>
          <h3>{name}</h3>
          <Clock timezone={tz} size={150} />
        </div>
      ))}
    </div>
  );
}

// Clock with custom number visibility and styling
function CustomNumbersClock() {
  return (
    <Clock 
      primaryNumbersOpacity={1}
      secondaryNumbersOpacity={0.5}
      primaryNumbersColor="blue"
      secondaryNumbersColor="gray"
      size={200}
    />
  );
}

// Countdown with controls
function ControllableCountdown() {
  const countdown = useClockCountDown({
    minutes: 10,
    enabled: false
  });

  return (
    <div>
      <div>{countdown.minutes}:{countdown.seconds}</div>
      <button onClick={countdown.start}>Start</button>
      <button onClick={countdown.pause}>Pause</button>
      <button onClick={countdown.resume}>Resume</button>
      <button onClick={countdown.reset}>Reset</button>
    </div>
  );
}
```

## Features

- **Real-time Updates**: Automatic time synchronization with configurable frequency
- **Timezone Support**: Global timezone compatibility with IANA timezone database
- **Customizable Styling**: Full control over appearance and theming
- **TypeScript Support**: Complete type definitions for better developer experience
- **Accessibility**: Built with WCAG compliance and screen reader support
- **Performance Optimized**: Efficient updates with minimal re-renders
- **Responsive Design**: Adapts to different screen sizes automatically

## Sponsor

<div align="center">

[<kbd> <br/> ❤️ If this component has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

Your support helps me:

- Keep the project actively maintained with timely bug fixes and security updates	
- Add new features, improve performance, and refine the developer experience	
- Expand test coverage and documentation for smoother adoption	
- Ensure long‑term sustainability without relying on ad hoc free time	
- Prioritize community requests and roadmap items that matter most

Open source thrives when those who benefit can give back—even a small monthly contribution makes a real difference. Sponsorships help cover maintenance time, infrastructure, and the countless invisible tasks that keep a project healthy.

Your help truly matters.

💚 [Become a sponsor](https://github.com/sponsors/gfazioli?o=esc) today and help me keep this project reliable, up‑to‑date, and growing for everyone.

---
  
https://github.com/user-attachments/assets/727a8634-28ee-4279-80b1-dcf2cb7f5961

---

[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-clock&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-clock&Timeline)


