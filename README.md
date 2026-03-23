# Data Breach Checker 🛡️

A modern web application to check if your email has been compromised in known data breaches. Built with **React**, **TypeScript**, and **Vite**.

![Dark Mode UI](https://img.shields.io/badge/UI-Dark%20Mode-1a1a2e?style=flat-square) ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)

## Features

- 🔍 **Breach Search** – Enter an email to check against a breach database
- 🚨 **Severity Badges** – Critical, High, Medium, Low color-coded indicators
- 📊 **Stats Dashboard** – Summary of breaches, data types exposed, and critical count
- 🛡️ **Security Recommendations** – Context-aware tips based on exposed data types
- ✅ **Safe State** – Clear confirmation when no breaches are found
- 🎨 **Premium Dark UI** – Glassmorphism, gradient accents, smooth animations
- 📱 **Responsive** – Works on desktop and mobile

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)

### Installation

```bash
git clone https://github.com/mohammedthofiq/Data-Breach-checker.git
cd Data-Breach-checker
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Test Emails

| Email | Breaches |
|-------|----------|
| `john@example.com` | 3 (critical, high, medium) |
| `alice@example.com` | 3 (critical, high, low) |
| `jane@example.com` | 1 (critical) |
| `test@test.com` | 1 (medium) |
| Any other email | 0 (safe) |

## Tech Stack

- **React 18** – Component-based UI
- **TypeScript** – Type safety
- **Vite** – Fast dev server & build tool
- **Vanilla CSS** – Custom design system with CSS variables

## Project Structure

```
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── index.tsx          # Entry point
    ├── index.css          # Global styles
    ├── App.tsx            # Main application
    ├── SearchForm.tsx     # Email search component
    ├── BreachResults.tsx  # Results display
    ├── Recommendations.tsx # Security tips
    └── breachData.ts      # Mock breach database
```

## License

This project is for educational purposes. Data is simulated.
