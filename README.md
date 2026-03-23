# Design System
 
A complete, production-ready design system built with a warm earthy palette. Includes Figma component library and fully coded HTML/CSS implementation with advanced animations.
 
## About this project
 
This design system was built using a modern AI-assisted workflow:
- Component architecture and creative direction by Lívia Kiss / ALIVE Design Studio
- Colour palette, typography pairing, and design decisions by Lívia Kiss
- Built using Claude Code (Anthropic) + Figma MCP for design-to-code translation
- Animations and interactions designed and iterated by Lívia Kiss
 
> AI tools were used as part of the build process — the same way a designer uses Figma, Git, or any other professional tool. All creative decisions, design direction, and final output are the work of the designer.
 
---
 
## Colour palette
 
| Token | Hex | Usage |
|---|---|---|
| Background | `#101211` | Page background |
| Surface | `#292818` | Card, component backgrounds |
| Surface 2 | `#32301F` | Elevated surfaces |
| Primary | `#48252F` | Buttons, key accents |
| Accent | `#857861` | Secondary accents, borders |
| Text | `#E7D4BB` | Primary text, headings |
| Muted | `#6B6050` | Secondary text, placeholders |
 
## Typography
 
- **Display / Headings** — Cormorant Garamond (editorial serif)
- **Body / UI** — DM Sans (clean, readable sans-serif)
 
---
 
## File structure
 
```
design-system/
├── figma/                  ← Figma reference screenshots
├── src/
│   ├── tokens.css          ← All CSS custom properties
│   ├── components/
│   │   ├── button.css
│   │   ├── input.css
│   │   ├── card.css
│   │   ├── badge.css
│   │   ├── navigation.css
│   │   ├── modal.css
│   │   └── toast.css
│   └── utils/
│       ├── reset.css
│       ├── typography.css
│       ├── spacing.css
│       └── animations.css
├── index.html              ← Live component showcase
└── README.md
```
 
---
 
## How to use
 
### 1. Import tokens
Always import `tokens.css` first — all components depend on these variables:
```html
<link rel="stylesheet" href="src/tokens.css">
```
 
### 2. Import components
```html
<link rel="stylesheet" href="src/components/button.css">
```
 
### 3. Use components
```html
<button class="btn btn--primary btn--md">Get started</button>
<button class="btn btn--secondary btn--md">Learn more</button>
```
 
---
 
## Components
 
| Component | Variants | States |
|---|---|---|
| Button | Primary, Secondary, Ghost, Subtle | Default, Hover, Active, Disabled |
| Input | — | Default, Focused, Error, Disabled |
| Card | Content, Feature | Default, Hover |
| Badge | Primary, Success, Warning, Danger, Neutral | — |
| Navigation | — | Default, Mobile |
| Modal | — | Open, Closed |
| Toast | Success, Error, Warning, Info | — |
 
---
 
## Animations
 
All animations respect `prefers-reduced-motion` — they turn off automatically for users who prefer reduced motion.
 
- **Magnetic cursor** — elements gently pull toward the cursor
- **Liquid gradient border** — animated rotating gradient on focus states
- **Ink reveal** — headings animate in as viewport-triggered ink wash
- **Surface shimmer** — diagonal light sweep on card hover
- **Ripple effect** — click-point ripple on buttons
 
---
 
## Figma file
 
[[View Figma component library →](https://www.figma.com/design/QLs5o2P8NcAZJ9YHs1cgYv/Design-System-v1.0?node-id=19-338&t=wbF4509UDQosrS0j-1)]
 
---
 
## Tools used
 
- Figma (component design + prototyping)
- Claude Code by Anthropic (AI-assisted code generation)
- VS Code
- Git / GitHub
 
---
 
*Made by [Lívia Kiss](https://alivedesignstudio.net) · ALIVE Design Studio*