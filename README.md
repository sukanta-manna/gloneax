# gloneax - Hazard Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-ff5d01.svg)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)

**gloneax** is a web platform for real-time tracking of natural hazards and global health metrics. It provides interactive geospatial insights, localized reporting, and disaster intelligence across multiple languages.

---

## 🚀 Features

* **Natural Disaster Monitoring**: Earthquakes, volcanic eruptions, storms, tsunamis, floods, droughts, wildfires, and avalanches.
* **Global Health Metrics**: Child mortality, hepatitis, HIV, life expectancy, mumps, and tuberculosis tracking.
* **Geospatial Maps**: Interactive Leaflet maps with custom popups, marker overlays, and dataset visualizations.
* **Multilingual (i18n)**: Full internationalization support with dynamic pathing (e.g., `/es/earthquakes`).
* **Modern UI & Dark Mode**: Responsive interface built with Tailwind CSS, React, Shadcn UI components, and theme toggling.

---

## 🛠️ Tech Stack

* **Framework**: [Astro](https://astro.build/)
* **UI & Components**: [React](https://react.dev/), [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Mapping**: Leaflet / React-Leaflet
* **Icons & Branding**: Custom SVG vectors and favicon suite

---

## 📂 Repository Structure

```text
gloneax/app/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── android-chrome-192x192.png
│   └── android-chrome-512x512.png
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── collapsible.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── tooltip.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── Logo.tsx
│   │   ├── Map.astro
│   │   ├── MapContainer.tsx
│   │   └── ThemeToggle.tsx
│   ├── i18n/
│   │   ├── ui.ts
│   │   └── utils.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── [lang]/
│   │   │   ├── avalanches.astro
│   │   │   ├── childmortality.astro
│   │   │   ├── droughts.astro
│   │   │   ├── earthquakes.astro
│   │   │   ├── floods.astro
│   │   │   ├── hepatitis.astro
│   │   │   ├── hiv.astro
│   │   │   ├── index.astro
│   │   │   ├── lifeexpectancy.astro
│   │   │   ├── logo.astro
│   │   │   ├── mumps.astro
│   │   │   ├── storms.astro
│   │   │   ├── tsunamis.astro
│   │   │   ├── tuberculosis.astro
│   │   │   ├── volcaniceruptions.astro
│   │   │   └── wildfires.astro
│   │   ├── avalanches.astro
│   │   ├── childmortality.astro
│   │   ├── droughts.astro
│   │   ├── earthquakes.astro
│   │   ├── floods.astro
│   │   ├── hepatitis.astro
│   │   ├── hiv.astro
│   │   ├── index.astro
│   │   ├── lifeexpectancy.astro
│   │   ├── logo.astro
│   │   ├── mumps.astro
│   │   ├── storms.astro
│   │   ├── tsunamis.astro
│   │   ├── tuberculosis.astro
│   │   ├── volcaniceruptions.astro
│   │   └── wildfires.astro
│   └── styles/
│       └── globals.css
├── .gitignore
├── .prettierrc
├── astro.config.mjs
├── components.json
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.cjs
└── tsconfig.json
```
🏁 Getting Started
Prerequisites
Node.js: v18.17.0 or higher
npm / pnpm / yarn

Installation
Clone the repository:
```
git clone [https://github.com/gloneax/app.git](https://github.com/gloneax/app.git)
cd app
```
Install dependencies:
```
pnpm install
```
Start local development:
```
pnpm run dev
```
View app:
Open http://localhost:4321 in your browser.

License:
Distributed under the MIT License. See LICENSE for details.
