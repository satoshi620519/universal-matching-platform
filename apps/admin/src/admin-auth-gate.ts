const API_BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');
const GATE_ID = 'universal-admin-auth-gate';
const SESSION_CONTROLS_ID = 'universal-admin-session-controls';

function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function setLocked(locked: boolean): void {
  document.body.style.visibility = locked ? 'hidden' : 'visible';
}

function renderSessionControls(): void {
  const existing = document.getElementById(SESSION_CONTROLS_ID);
  if (existing) existing.remove();

  const controls = document.createElement('div');
  controls.id = SESSION_CONTROLS_ID;
  controls.style.cssText = 'position:fixed;top:16px;right:16px;z-index:99998;display:flex;gap:8px;align-items:center;font-family:system-ui,sans-serif;';
  controls.innerHTML = `
    <button type="button" style="padding:8px 12px;border:1px solid #cfc7b8;border-radius:8px;background:white;color:#332f29;font-weight:600;cursor:pointer">Sign out</button>
  `;
  document.body.appendChild(controls);

  const button = controls.querySelector('button') as HTMLButtonElement;
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const response = await fetch(apiUrl('/auth/sign-out'), {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Unable to sign out.');
      }
      controls.remove();
      renderLogin();
    } catch (errorValue) {
      button.disabled = false;
      window.alert(errorValue instanceof Error ? errorValue.message : 'Unable to sign out.');
    }
  });
}

function renderLogin(errorMessage = ''): void {
  const existing = document.getElementById(GATE_ID);
  if (existing) existing.remove();
  const controls = document.getElementById(SESSION_CONTROLS_ID);
  if (controls) controls.remove();
  document.body.style.visibility = 'visible';

  const gate = document.createElement('div');
  gate.id = GATE_ID;
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.style.cssText = 'position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:#f5f2ea;padding:24px;box-sizing:border-box;';
  gate.innerHTML = `
    <div style="width:min(420px,100%);background:white;border:1px solid #ddd6c8;border-radius:16px;padding:28px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,.12);font-family:system-ui,sans-serif">
      <h1 style="margin:0 0 8px">Universal Admin</h1>
      <p style="margin:0 0 20px;color:#665f55">Sign in to continue.</p>
      <form style="display:grid;gap:14px">
        <label style="display:grid;gap:6px">Email<input name="email" type="email" autocomplete="username" required style="padding:10px;border:1px solid #cfc7b8;border-radius:8px" /></label>
        <label style="display:grid;gap:6px">Password<input name="password" type="password" autocomplete="current-password" required style="padding:10px;border:1px solid #cfc7b8;border-radius:8px" /></label>
        <button type="submit" style="padding:11px;border:0;border-radius:8px;background:#2e5c45;color:white;font-weight:600;cursor:pointer">Sign in</button>
        <p class="admin-auth-error" role="alert" hidden style="margin:0;color:#a32929"></p>
      </form>
    </div>
  `;
  document.body.appendChild(gate);
  const form = gate.querySelector('form') as HTMLFormElement;
  const error = gate.querySelector('.admin-auth-error') as HTMLParagraphElement;
  if (errorMessage) {
    error.textContent = errorMessage;
    error.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const data = new FormData(form);
    submit.disabled = true;
    error.hidden = true;
    try {
      const response = await fetch(apiUrl('/auth/sign-in'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: String(data.get('email') ?? ''),
          password: String(data.get('password') ?? ''),
        }),
      });
      const result = await response.json().catch(() => ({})) as { authenticated?: unknown };
      if (!response.ok || result.authenticated !== true) {
        throw new Error('Invalid email or password.');
      }
      window.location.reload();
    } catch (errorValue) {
      error.textContent = errorValue instanceof Error ? errorValue.message : 'Unable to sign in.';
      error.hidden = false;
      submit.disabled = false;
    }
  });
}

async function verifySession(): Promise<boolean> {
  try {
    const response = await fetch(apiUrl('/administration/me/capabilities'), {
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function boot(): Promise<void> {
  setLocked(true);
  if (await verifySession()) {
    setLocked(false);
    renderSessionControls();
    return;
  }
  renderLogin();
}

void boot();
