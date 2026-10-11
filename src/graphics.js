const world = document.querySelector('#world');
let failed = false;

export function reportGraphicsFailure(reason, detail = '') {
  failed = true;
  let panel = document.querySelector('#graphics-error');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'graphics-error';
    panel.setAttribute('role', 'alert');
    panel.innerHTML = `<span class="eyebrow">3D RENDERER UNAVAILABLE</span>
      <h2>The bar couldn’t light up.</h2>
      <p class="graphics-reason"></p>
      <p>This game requires <b>WebGL 2</b>. In Chrome, open <b>Settings → System</b>, enable <b>Use graphics acceleration when available</b>, then relaunch Chrome.</p>
      <p>If it still fails, open <b>chrome://gpu</b> and check “WebGL” and “WebGL2” under Graphics Feature Status. Update your browser and graphics drivers, or use Brave where the scene works.</p>
      <details><summary>Technical details</summary><pre></pre></details>
      <button type="button">Retry 3D renderer</button>`;
    panel.querySelector('button').onclick = () => location.reload();
    document.body.append(panel);
  }
  panel.querySelector('.graphics-reason').textContent = reason;
  panel.querySelector('pre').textContent = detail || 'No additional browser diagnostics were provided.';
  document.body.classList.add('graphics-unavailable');
  window.dispatchEvent(new CustomEvent('graphics-status', { detail: { working: false } }));
}

export function graphicsWorking() { return !failed; }

export function checkWebGL() {
  const canvas = document.createElement('canvas');
  let status = '';
  canvas.addEventListener('webglcontextcreationerror', event => { status = event.statusMessage; });
  try {
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
    if (!gl) {
      reportGraphicsFailure('This browser could not create a WebGL 2 graphics context.',
        `WebGL 2 context: unavailable\nBrowser: ${navigator.userAgent}\n${status}`);
      return false;
    }
    if (gl.isContextLost()) throw new Error('WebGL context was lost immediately after creation.');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch (error) {
    reportGraphicsFailure('The browser’s graphics system failed during the WebGL check.',
      `${error.message}\n${status}\nBrowser: ${navigator.userAgent}`);
    return false;
  }
}

export function watchRenderer(renderer) {
  const canvas = renderer.domElement;
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    reportGraphicsFailure('The browser lost its connection to the graphics renderer. Your shift has been paused.',
      `Event: webglcontextlost\n${event.statusMessage || ''}\nBrowser: ${navigator.userAgent}`);
  });
  canvas.addEventListener('webglcontextrestored', () => {
    // Reload rebuilds every GPU resource and starts a clean shift.
    const reason = document.querySelector('#graphics-error .graphics-reason');
    if (reason) reason.textContent = 'The graphics connection has recovered. Click Retry to rebuild the bar.';
  });
  world.dataset.graphics = 'webgl2';
}
