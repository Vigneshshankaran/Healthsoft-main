# Healthsoft Brand & Style Guide

This style guide outlines the brand identity, design principles, typography, color system, and UI rules for Healthsoft. It has been structured for clear understanding by developers and AI systems.

---

## 🛠️ Tech Stack & UI Framework
- *Core UI Framework*: Material UI (MUI) v9+ (@mui/material, @emotion/react, @emotion/styled)
- *Icons*: MUI Icons (@mui/icons-material)
- *Typography Integration*: Google Fonts (Sora and Plus Jakarta Sans and Instrument Serif)

---

## 👥 Brand Core & Mission
Healthsoft is a connected healthcare technology company focused on helping families care for elderly parents remotely.

- *Mission: *"Technology that cares, even when you can't be there."
- *Primary Audience*:
  - Elderly parents living independently.
  - Adult children in India.
  - NRI families living abroad.
  - Families seeking peace of mind and remote care visibility.
- *Core Promise*: Enable independence for parents while providing visibility and reassurance for family members.

### 🎭 Brand Personality
- *Caring*: Put people before products. Every feature reduces family worry.
- *Human*: Use natural language. Speak like a family member, not a corporation.
- *Steady*: Calm, dependable, reliable. Never create panic.
- *Bold*: Acknowledge the emotional reality of distance; take a clear point of view.

### 🗣️ Tone of Voice
- *Do Use*: Warm, Human, Direct, Reassuring, Trustworthy, Calm, Practical.
- *Do NOT Use*: Fear-based messaging, Corporate jargon, Medical jargon, Overly technical explanations, Sales pressure, Cold product language.

---

## ✍️ Copywriting & Messaging Rules
- *Brand Signature: *Driven by Love. Defined by Care.
- *Campaign Line: *They raised you. Now it's your turn.
- *Value Proposition: *Complete care for your parents, from anywhere in the world.
- *Preferred Terminology*:
  - *Yes: *Parents, Family, Loved ones, Care, Independence, Peace of mind, Safety, Support, Connected.
  - *No: *Patient, Monitoring target, Medical subject, User, Dependency, Surveillance.

### 📝 Writing Formula
1. Acknowledge concern
2. Offer reassurance
3. Present solution
4. Emphasize independence

Example:
- *Good: *"Know they're safe, even when you're miles away."
- *Bad: *"Our advanced monitoring infrastructure delivers comprehensive elder supervision."

---

## 🎨 Color System

| Category | Color Name | HEX Code | RGB | Primary Usage |
| :--- | :--- | :--- | :--- | :--- |
| *Primary* | Healthsoft Orange | #EC8D20 | 236, 141, 32 | CTA buttons, Logo, Highlights, Links, Icons, Accents |
| *Secondary* | Healthsoft Blue | #0E172A | 14, 23, 42 | Headings, Navigation, Footer, Dark sections |
| *Neutral* | Black | #000000 | 0, 0, 0 | Text headings |
| *Neutral* | Deep Slate | #202B41 | 32, 43, 65 | Body text, borders, card text |
| *Neutral* | Light Grey | #D9D9D9 | 217, 217, 217 | Borders, subtle dividers |
| *Tertiary* | Warm Cream | #F7F0E6 | 247, 240, 230 | Main layouts, card backgrounds, light sections |
| *Tertiary* | Sage Teal | #4A8C6F | 74, 140, 111 | Statuses, charts, badges (Positive / OK) |
| *Tertiary* | Steel Blue | #3A7CB8 | 58, 124, 184 | Statuses, charts, secondary badges (Informational) |
| *Tertiary* | Warm Coral | #E8654A | 232, 101, 74 | Statuses, alerts, badges (Warning / Action) |

---

## 🔤 Typography System
- *Primary Display Font: **Sora* (used for hero headlines, landing page headings, marketing banners, and major section titles).
  - Weights: Extra Bold (800), Semi Bold (600).
- *Primary Body Font: **Plus Jakarta Sans* (used for paragraphs, UI content, buttons, product descriptions, and notifications).
  - Weights: Regular (400), Medium (500), Bold (700).
- *Secondary Editorial Font: **Instrument Serif* (used for testimonials, quotes, emotional statements, and highlight sections - use sparingly).

---

## 📐 UI & Visual Guidelines
- *Visual Direction*: Warm, Human, Calm, Trustworthy, Family-first, Modern, Premium. Avoid clinical hospital styling, corporate SaaS appearance, and cold healthcare visuals.
- *The Pulse Graphic: Represents care in motion, continuous support, and connection. Used as section dividers or background graphics. *Never represent a flatline.
- *Image Style*: Focus on real families, elderly parents, care moments, human interaction, warm lighting, and natural expressions. Avoid stock-photo feel or medical equipment focus.
- *Interactive Elements*:
  - *Buttons*: Healthsoft Orange primary CTA, rounded corners, clear action language.
  - *Headings*: Sora Extra Bold.
  - *Body*: Plus Jakarta Sans Regular.
  - *Section Backgrounds*: White (#FFFFFF), Warm Cream (#F7F0E6), or Healthsoft Blue (#0E172A).
  - *Accent Elements*: Healthsoft Orange (#EC8D20).

---

## 💻 MUI Custom Theme Reference (TypeScript)
Use this theme configuration in React to implement the design system:

typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#EC8D20', // Healthsoft Orange
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0E172A', // Healthsoft Blue
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F0E6', // Warm Cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202B41', // Deep Slate
      secondary: '#64748B', // Muted Gray
    },
    error: {
      main: '#E8654A', // Warm Coral
    },
    success: {
      main: '#4A8C6F', // Sage Teal
    },
    info: {
      main: '#3A7CB8', // Steel Blue
    },
    divider: '#D9D9D9', // Light Grey
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
      borderRadius: '8px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});