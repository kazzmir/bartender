# After Hours

A first-person browser bartending game set in the Amber Room. Built with Three.js, Vite, and Lucide.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` creates a production build in `dist/`.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the game with Node.js 22 and deploys `dist/` to GitHub Pages on pushes to `master` or `main`. It can also be run manually from the Actions tab.

One-time setup:

1. Open the GitHub repository’s **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push the workflow to GitHub, or run **Actions → Deploy game to GitHub Pages → Run workflow**.

For `kazzmir/bartender`, the default site URL is **https://kazzmir.github.io/bartender/**. The workflow uses GitHub’s configured base path, so assets also work with a custom domain or a user/organization Pages site. No additional deployment secrets are required.

To check a repository-style build locally:

```sh
VITE_BASE_PATH=/bartender/ npm run build
VITE_BASE_PATH=/bartender/ npm run preview
```

Open `/bartender/` on the preview server. Normal local development continues to use `/`.

## Play

Up to three customers can wait at the bar, each with a separate order and patience timer. Two arrive together at the start; more arrive during your shift. Click a customer or their name in the order panel to inspect their recipe. Start by dragging a rocks glass (front row) or coupe (back row) from the glassware on the right of the prep counter onto the center mixing mat. Then add the correct ingredients and mix. You cannot pour without a glass, and each served drink needs a fresh glass. Then drag the 3D glass from the counter onto the intended customer and release: it slides over to them if the drink is correct, or returns to your workstation if not. You can also start the drag from the workstation’s glass icon. Earn tips and serve eight drinks to reach your shift goal. Play continues after reaching the goal.

- **1–9 / 0** for the first ten ingredients, or ingredient cards / 3D bottles: add a measured pour
- **Space**: mix
- **Left / Right arrow keys**: move along the bar
- **Drag prepared glass onto a customer**: serve
- **M** or **Stir / Shake**: change mixing tool
- Drag a glass from the counter onto the mixing mat: choose glassware
- **C**: clear your drink and glass; choose a fresh glass to restart
- **R**: recipe book
- **Escape**: pause / resume
- Drag the scene: look around

## Expanded cocktail menu

17 drinks and 17 ingredients, including Whiskey Sour, Margarita, Daiquiri, Cosmopolitan, Lemon Drop, White Russian, Espresso Martini, Boulevardier, Gold Rush, Bee’s Knees, Gimlet, and Tequila Old Fashioned.

Use **All / Spirits / Modifiers / Mixers** to browse the pantry; the ingredient row scrolls horizontally. Each click dispenses the quantity shown in the selected customer's recipe. Ingredients and amounts are both checked when serving, so a pour measured for a different order may not be suitable. The recipe book includes quantities, mixing methods, and glassware. New orders vary after the introductory customers.

These are classic house recipes with garnishes omitted; the Whiskey Sour is egg-free and the Martini is explicitly shaken on request. The Total Wine example URL was access-blocked during development, so these are not claimed to reproduce its recipe collection.

## Graphics troubleshooting

The game requires WebGL 2. It checks support at startup and displays a diagnostic panel if context creation or rendering fails. A lost graphics context pauses the shift and offers a reload.

If Chrome does not render but Brave does, enable **Settings → System → Use graphics acceleration when available**, then relaunch Chrome. Check **chrome://gpu** for WebGL/WebGL2 status; browser GPU blocklists, disabled acceleration, or graphics drivers can affect browsers differently. The in-game panel includes browser-provided technical details.

## Browser tests

```sh
npx playwright install chromium
npm test
```

Tests cover the 17-drink catalog and amount validation, ingredient filters and recipe book, physical glass selection, rejected off-mat drops, pouring without a glass, concurrent arrivals, correct and incorrect drag targets, drink delivery, and WebGL failure/context-loss handling.

Sound is generated locally through Web Audio: pouring, stirring/shaking, serving, arrivals, departures, glass clinks, tips, and patience warnings, plus a quiet ambient backdrop. Audio starts after the first click or keypress. The header sound button mutes all audio and remembers the setting; pausing the game silences audio until resumed. All scene geometry and bottle textures are generated in code. Google Fonts is optional; system fonts are used when unavailable.
