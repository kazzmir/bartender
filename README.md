# After Hours

A first-person browser bartending game set in the Amber Room. Built with Three.js, Vite, and Lucide.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite. `npm run build` creates a production build in `dist/`.

## Play

Up to three customers can wait at the bar, each with a separate order and patience timer. Two arrive together at the start; more arrive during your shift. Click a customer or their name in the order panel to inspect their recipe. Add the correct ingredients, choose glassware, and mix. Then drag the 3D glass from the counter onto the intended customer and release: it slides over to them if the drink is correct, or returns to your workstation if not. You can also start the drag from the workstation’s glass icon. Earn tips and serve eight drinks to reach your shift goal. Play continues after reaching the goal.

- **1–6** or ingredient cards / 3D bottles: add a measured pour
- **Space**: mix
- **Left / Right arrow keys**: move along the bar
- **Drag prepared glass onto a customer**: serve
- **M** or **Stir / Shake**: change mixing tool
- Click the glass name: switch rocks / coupe glass
- **C**: reset your drink
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

Tests cover concurrent arrivals, correct and incorrect drag targets, drink delivery, and WebGL failure/context-loss handling.

Sound is optional and generated locally through Web Audio. All scene geometry and bottle textures are generated in code. Google Fonts is optional; system fonts are used when unavailable.
