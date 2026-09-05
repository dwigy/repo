import { load, onChange } from './store.js';
import { render, bind, toast } from './ui.js';

async function boot() {
  await load();
  bind();
  render();
  onChange(() => { /* state saved automatically by store.commit */ });

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw?.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) toast('Update ready — relaunch the app to get it.', 4000);
        });
      });
    } catch { /* offline support unavailable */ }
  }
}
boot();
