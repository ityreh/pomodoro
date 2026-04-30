# Pomodoro Focus

A Pomodoro timer with built-in time tracking.

## What is the Pomodoro Technique?

The Pomodoro Technique is a time management method invented by [Francesco Cirillo](https://francescocirillo.com/). The idea is simple:

1. Decide on a task to work on
2. Set a timer for 25 minutes and work with full focus
3. Take a short 5-minute break when the timer rings
4. After every 4 pomodoros, take a longer 15-minute break

Alternating focused work with structured breaks reduces mental fatigue and keeps you productive throughout the day.

## Features

### Timer
- Three modes: **Pomodoro** (25 min) · **Short Break** (5 min) · **Long Break** (15 min)
- Animated SVG circular progress ring, color-coded per mode
- Label your current task and assign it to a project before starting
- Live countdown shown in the browser tab title
- Audio notification when a session ends (Web Audio API — no files needed)
- Auto-start breaks or pomodoros optionally

### Time Tracking
- Every completed Pomodoro is automatically saved as a time entry
- Entries grouped by day with daily total (like Clockify's time log)
- Edit description or project on any entry inline
- Delete entries with a confirmation step

### Projects
- Four built-in projects: Work · Personal · Learning · Health
- Color-coded badges on every entry

### Settings
- Configurable durations for all three timer modes
- Set the long break interval (default: every 4 pomodoros)
- Toggle auto-start for breaks and pomodoros
- Toggle sound notifications

### Responsive Design
- Two-column layout on desktop (timer + log side by side)
- Stacked single-column layout on mobile

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Contributing

If you're missing a feature, open an issue and we can discuss the implementation.
