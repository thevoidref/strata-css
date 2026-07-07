# Strata CSS

**Strata CSS** is a lightweight, layered CSS framework for building maintainable, responsive interfaces with modern CSS.

It provides a structured foundation of design tokens, global rules, layout primitives, UI primitives, and reusable components — without JavaScript, build tools, package managers, or runtime dependencies.

Strata CSS originated from the development of the CH TeCH website and is evolving into an independent CSS foundation for static websites and small-to-medium web projects.

---

## Philosophy

Strata CSS is built around a simple idea:

> Build interfaces from stable layers, starting with foundations and progressing toward increasingly specific patterns.

The framework favors:

* native CSS over tooling and abstraction;
* composition over excessive component variants;
* reusable primitives over page-specific styling;
* explicit architecture over convention hidden in tooling;
* progressive enhancement;
* low dependency and deployment complexity;
* readable code that remains understandable without framework knowledge.

The goal is not to replace CSS, but to provide a coherent structure for using it well.

---

## Architecture

Strata CSS follows a layered architecture inspired by ITCSS.

Styles progress from broad, low-specificity foundations toward increasingly explicit interface patterns.

```text
Settings
    ↓
Tools
    ↓
Generic
    ↓
Elements
    ↓
Objects
    ↓
Primitives
    ↓
Layouts
    ↓
Components
    ↓
Utilities
    ↓
Overrides
```

The exact project structure may evolve as the framework develops, but the architectural principle remains stable: dependencies flow downward, while specificity and explicitness increase through the layers.

---

## Features

* Modern CSS with no preprocessing requirement
* Layered, ITCSS-inspired architecture
* Semantic design tokens
* Responsive typography and spacing systems
* Container and layout primitives
* Grid, stack, cluster, and sidebar composition patterns
* Reusable UI primitives
* Form and button foundations
* Navigation primitives
* Feedback primitives
* Overlay primitives
* Reusable components built from lower-level layers
* Visual testing pages for framework development
* Optional development utilities for layout debugging
* No JavaScript dependency
* No build step
* No package manager
* No runtime dependencies

---

## Tech Stack

* HTML5
* Modern CSS
* CSS custom properties
* Native responsive CSS features
* ITCSS-inspired architecture

No framework, preprocessor, bundler, or JavaScript runtime is required.

---

## Project Structure

```text
assets/
└── css/
    ├── 01-settings/
    ├── 02-tools/
    ├── 03-generic/
    ├── 04-elements/
    ├── 05-objects/
    ├── 06-primitives/
    ├── 07-layouts/
    ├── 08-components/
    ├── 09-utilities/
    ├── 10-overrides/
    └── style.css

tests/
    Visual test and preview pages

docs/
    Architecture and framework documentation
```

> The directory structure may change while Strata CSS is under active development. See `ARCHITECTURE.md` for the current source of truth.

---

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd <repository>
```

Include the main stylesheet in your HTML:

```html
<link rel="stylesheet" href="assets/css/style.css">
```

Then use Strata's foundations, primitives, layouts, and components directly in your markup.

No installation or compilation step is required.

For local development, you can open an HTML file directly in your browser or start a simple static server:

```bash
python -m http.server
```

Then visit:

```text
http://localhost:8000
```

---

## Framework Layers

### Foundations

The lowest layers define the global system:

* colors;
* typography;
* spacing;
* sizing;
* borders;
* shadows;
* opacity;
* motion;
* responsive scales;
* global element defaults.

These layers establish the visual language used throughout the framework.

### Primitives

Primitives provide small, reusable interface behaviors and patterns.

Examples include:

* buttons;
* form controls;
* navigation elements;
* feedback elements;
* progress indicators;
* overlays;
* typography patterns.

Primitives are intentionally generic and composable.

### Layouts

Layouts control spatial relationships between elements without defining their visual identity.

Examples include:

* containers;
* stacks;
* clusters;
* grids;
* sidebars;
* split layouts;
* responsive wrappers.

Layout classes should remain independent from specific business content or page sections.

### Components

Components combine tokens, primitives, and layouts into recognizable interface patterns.

Examples may include:

* cards;
* navigation bars;
* hero sections;
* pricing blocks;
* testimonials;
* feature sections;
* call-to-action sections.

Components are the most explicit reusable layer of the framework and should be built from lower-level Strata foundations whenever possible.

### Utilities and Overrides

Utilities provide narrow, explicit adjustments.

Overrides are reserved for exceptional cases where normal composition is insufficient.

Both layers should remain small and intentional.

---

## Development

Strata CSS is currently under active development.

Framework development follows a bottom-up progression:

```text
Tokens
→ Global foundations
→ Objects
→ Primitives
→ Layouts
→ Components
→ Application patterns
```

New abstractions should solve repeated problems rather than anticipate hypothetical ones.

Before adding a new primitive, layout, component, or utility, consider whether the problem can already be solved through composition of existing framework layers.

---

## Testing

The `tests/` directory contains visual test pages used to develop and validate framework behavior.

These pages are intended to verify:

* component states;
* responsive behavior;
* token consistency;
* layout composition;
* accessibility behavior;
* interactions between framework layers.

The project may also include optional development-only styles for visual debugging and layout inspection.

---

## Documentation

Project documentation includes:

* `ARCHITECTURE.md` — framework architecture, layer responsibilities, and dependency rules;
* `AGENTS.md` — instructions and constraints for AI coding agents;
* `ROADMAP.md` — planned framework development and improvements.

These documents should be consulted before making significant architectural changes.

---

## Origin

Strata CSS began as the CSS architecture behind the CH TeCH website, a static website for a local IT tutoring and troubleshooting service.

As the styling system grew beyond the needs of a single landing page, its reusable foundations, primitives, layouts, and components were separated conceptually into an independent framework.

CH TeCH remains an early real-world application and testing ground for the framework.

---

## Contributing

Contributions are welcome.

Before making significant architectural or styling changes:

1. Read `ARCHITECTURE.md`.
2. Check whether an existing primitive or layout can solve the problem through composition.
3. Avoid introducing application-specific rules into generic framework layers.
4. Preserve the dependency direction of the architecture.

Strata CSS favors deliberate abstractions over framework growth for its own sake.

---

## License

No license has been specified yet.
