const API_BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '');
const GATE_ID = 'universal-admin-auth-gate';

function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

function setLocked(locked: boolean): void {
  document.documentElement.dataset.adminAuthLocked = locked ? 'true' : 'false';
}

function renderLogin(errorMessage = ''): void {
  const existing = document.getElementById(GATE_ID);
  if (existing) existing.remove();

  const gate = document.createElement('div');
  gate.id = GATE_ID;
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.innerHTML = `
    <div class="admin-auth-card">
      <h1>Universal Admin</h1>
      <p>Sign in to continue.</p>
      <form>
        <label>Email<input name="email" type="email" autocomplete="username" required /></label>
        <label>Password<input name="password" type="password" autocomplete="current-password" required /></label>
        <button type="submit">Sign in</button>
        <p class="admin-auth-error" role="alert" hidden></p>
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
    return;
  }
  renderLogin();
}

void boot();
