# Pincoin — PinkWallet Landing

Landing page for **PinkWallet**, a crypto wallet product. The site presents the product (AI-powered, gas-free, free debit card), explains features, and collects waitlist signups.

## Tech Stack

- **Build:** [Vite](https://vitejs.dev/) 4.x
- **Templating:** [Handlebars](https://handlebarsjs.com/) via `vite-plugin-handlebars` (HTML partials for header, footer, sections)
- **Styles:** [Sass](https://sass-lang.com/) (modular layout, base, vendors)
- **Scripts:** JavaScript (ES modules), TypeScript for config
- **Animations:** [GSAP](https://greensock.com/gsap/), [Animate.css](https://animate.style/), [WOW.js](https://wowjs.uk/)

## Features

- **Dark / light theme** — theme toggle with `data-theme` and theme-aware assets
- **Responsive layout** — adaptive breakpoints and picture/srcset for images
- **Modular structure** — reusable Handlebars partials in `src/templates` and `src/sections`
- **Code quality** — ESLint + Prettier, format on save–friendly

## Project Structure

```
├── public/           # Static assets (images, favicon)
├── src/
│   ├── index.html    # Main page (includes partials)
│   ├── js/           # Entry and app scripts
│   ├── sections/     # Handlebars partials — page sections
│   ├── templates/    # Handlebars partials — header, footer, popups
│   └── styles/       # Sass (base, layout, vendors)
├── vite.config.js
└── getHTMLFileNames.js  # Multi-page build entries
```

## Requirements

- [Node.js](https://nodejs.org/) v16+

## Commands

| Command        | Description                    |
|----------------|--------------------------------|
| `npm install`  | Install dependencies           |
| `npm run dev`  | Start dev server (port 3000)   |
| `npm run build`| TypeScript check + production build |
| `npm run preview` | Preview production build   |
| `npm run lint` | Run ESLint                     |

## Development

1. Install dependencies: `npm i`
2. Start dev server: `npm run dev`

Edits to Handlebars partials in `src/templates/` or `src/sections/` trigger a full reload so layout changes are reflected immediately.


## License

MIT
