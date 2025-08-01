# Mantine Clock Component

https://github.com/user-attachments/assets/285cdda3-cd62-46a3-b028-816c34217530

---

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-clock?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-clock)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-clock?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-clock)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-clock?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-clock)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-clock?style=for-the-badge)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.

[![Mantine UI Library](https://img.shields.io/badge/-MANTINE_UI_LIBRARY-blue?style=for-the-badge&labelColor=black&logo=mantine
)](https://mantine.dev/)

It provides the capability to generate a dynamic clock effect, enabling the display of a wide variety of content in a visually engaging manner. This effect can enhance the overall user experience by drawing attention to important information, announcements, or promotions, allowing for a more interactive and captivating presentation.

[![Mantine Extensions](https://img.shields.io/badge/-Watch_the_Video-blue?style=for-the-badge&labelColor=black&logo=youtube
)](https://www.youtube.com/playlist?list=PL85tTROKkZrWyqCcmNCdWajpx05-cTal4)
[![Demo and Documentation](https://img.shields.io/badge/-Demo_%26_Documentation-blue?style=for-the-badge&labelColor=black&logo=typescript
)](https://gfazioli.github.io/mantine-clock/)
[![Mantine Extensions HUB](https://img.shields.io/badge/-Mantine_Extensions_Hub-blue?style=for-the-badge&labelColor=blue
)](https://mantine-extensions.vercel.app/)

👉 You can find more components on the [Mantine Extensions Hub](https://mantine-extensions.vercel.app/) library.


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
      showNumbers
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

// Custom styled clock
function ThemedClock() {
  return (
    <Clock 
      style={{
        '--clock-bg': 'var(--mantine-color-blue-1)',
        '--clock-border': 'var(--mantine-color-blue-6)'
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


<div align="center">
  
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-clock&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-clock&Timeline)

</div>
