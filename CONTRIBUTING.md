# Contributing to gloneax

First off, thank you for considering contributing to **gloneax**! Contributions from the community help build better open-source hazard intelligence and geospatial tools.

Please take a moment to review this document to ensure a smooth contribution process.

---

## 📋 Code of Conduct

By participating in this project, you are expected to maintain a respectful and welcoming environment for everyone. Please be mindful of others and keep discussions constructive.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs

If you encounter a bug or unexpected behavior:
1. Check the [Existing Issues](https://github.com/gloneax/app/issues) to see if it has already been reported.
2. If not, open a new issue with:
   * A clear, descriptive title.
   * Steps to reproduce the bug.
   * Expected vs. actual behavior.
   * Browser version, OS, and screenshots if applicable.

### 2. Requesting Features

Feature requests are always welcome! When opening an issue:
* Explain **why** the feature is useful.
* Describe **how** you envision it working within the UI/UX.

### 3. Submitting Pull Requests (PRs)

Follow these steps to submit your code changes:

#### Step A: Fork & Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone [https://github.com/YOUR-USERNAME/app.git](https://github.com/YOUR-USERNAME/app.git)
   cd app

#### Step B: Create a Branch
Create a topic branch from main using descriptive prefixes:
- feat/ for new features (e.g., feat/volcano-legend-overlay)
- fix/ for bug fixes (e.g., fix/sidebar-collapsed-flyout)
- docs/ for documentation updates (e.g., docs/update-readme)
- refactor/ for code cleanup

  ```bash
  git checkout -b fix/sidebar-collapsed-flyout
  ```
  
#### Step C: Setup & Development
Install dependencies and launch the dev server:
  ```bash
  pnpm install
  pnpm run dev
  ```

#### Step D: Commit Changes
Write clear, concise commit messages:
  ```bash
  git commit -m "fix: restore flyout visibility on collapsed sidebar"
  ```

#### Step E: Push & Open PR
+ Push your branch to your fork:
  ```bash
  git push origin fix/sidebar-collapsed-flyout
  ```

+ Navigate to github.com/gloneax/app and open a Pull Request.
+ Fill out the PR template with details about your changes.

🎨 Coding & UI Guidelines
To maintain code consistency across the project:

⚛️ React & UI Components
- Place React interactive components in *src/components/* and base primitives inside *src/components/ui/*.
- Use **Tailwind CSS** utility classes for layout, positioning, and styling. Avoid writing raw inline CSS unless necessary for dynamic SVG computations.
- Ensure all custom UI elements support both light and dark modes (dark: Tailwind variants).

 🌐 Internationalization (i18n)
 - New routes must be mirrored in both *src/pages/* and *src/pages/[lang]/*.
 - All user-facing strings should be added to *src/i18n/ui.ts* to support localization across available languages.

🖼️ SVG & Icon Assets
- Icon graphics should use Lucide React where available.
- Custom brand SVGs (like Logo.tsx) should utilize standard viewBox scaling (100 100 or proportional bounds) with explicit stroke widths to ensure high rendering clarity across dark and light themes.

 🧪 Testing Your Changes locally  
  Before submitting your PR, verify the static build succeeds without typescript or bundler errors:
  ```bash  
    # Build production bundle  
    pnpm run build
    
    # Preview production output
    pnpm run preview
  ```
❓ Questions?  
  If you have questions regarding the codebase or contribution process, feel free to open a discussion or ask in the relevant issue thread.  

Thank you for helping make gloneax better!
