# After Hours

A first-person browser bartending game set in the Amber Room. Built with Three.js, Vite, and Lucide.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` creates a production build in `dist/`.

## Play

Up to three customers can wait at the bar, each with a separate order and patience timer. Two arrive together at the start; more arrive during your shift. Click a customer or their name in the order panel to inspect their recipe. Start by dragging a rocks glass (front row) or coupe (back row) from the glassware on the right of the prep counter onto the center mixing mat. Then add the correct ingredients and mix. You cannot pour without a glass, and each served drink needs a fresh glass. Then drag the 3D glass from the counter onto the intended customer and release: it slides over to them if the drink is correct, or returns to your workstation if not. You can also start the drag from the workstation’s glass icon. Earn tips and serve eight drinks to reach your shift goal. Play continues after reaching the goal.

- **1–6** or ingredient cards / 3D bottles: add a measured pour
- **Space**: mix
- **Left / Right arrow keys**: move along the bar
- **Drag prepared glass onto a customer**: serve
- **M** or **Stir / Shake**: change mixing tool
- Drag a glass from the counter onto the mixing mat: choose glassware
- **C**: clear your drink and glass; choose a fresh glass to restart
- **R**: recipe book
- **Escape**: pause / resume
- Drag the scene: look around

## Graphics troubleshooting

The game requires WebGL 2. It checks support at startup and displays a diagnostic panel if context creation or rendering fails. A lost graphics context pauses the shift and offers a reload.

If Chrome does not render but Brave does, enable **Settings → System → Use graphics acceleration when available**, then relaunch Chrome. Check **chrome://gpu** for WebGL/WebGL2 status; browser GPU blocklists, disabled acceleration, or graphics drivers can affect browsers differently. The in-game panel includes browser-provided technical details.

## Browser tests

```sh
npx playwright install chromium
npm test
```

Tests cover physical glass selection, rejected off-mat drops, pouring without a glass, concurrent arrivals, correct and incorrect drag targets, drink delivery, and WebGL failure/context-loss handling.

Sound is generated locally through Web Audio: pouring, stirring/shaking, serving, arrivals, departures, glass clinks, tips, and patience warnings, plus a quiet ambient backdrop. Audio starts after the first click or keypress. The header sound button mutes all audio and remembers the setting; pausing the game silences audio until resumed. All scene geometry and bottle textures are generated in code. Google Fonts is optional; system fonts are used when unavailable.
