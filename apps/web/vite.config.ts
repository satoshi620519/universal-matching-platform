import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-live-matching',
      transformIndexHtml(html) {
        return html.replace('</body>', '    <script type="module" src="/src/live-matching.ts"></script>\n  </body>');
      },
    },
  ],
});
