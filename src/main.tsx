import { StrictMode, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GateScreen } from './components/GateScreen';
import { cachedGateState, resolveGateState, revealPage } from './lib/gate';
import { gate, site } from './config/site';
import './index.css';
import './styles/motion.css';

/** Lifts the index.html pre-paint hold only once the verdict is in the DOM. */
function Root({ gated }: { gated: boolean }) {
  useLayoutEffect(() => {
    // Set the title explicitly on BOTH branches: the prerender may have baked
    // either verdict's title into dist/index.html, so "restore the previous
    // one" is never safe. While gated, even the tab keeps the secret.
    document.title = gated ? gate.title : site.docTitle;
    revealPage();
  }, [gated]);
  return gated ? <GateScreen /> : <App />;
}

const root = createRoot(document.getElementById('root')!);

function render(gated: boolean) {
  root.render(
    <StrictMode>
      <Root gated={gated} />
    </StrictMode>,
  );
}

// Coming-soon gate boot (see src/lib/gate.ts): a visitor we've already shown
// the site gets it immediately and the flag is re-checked in the background;
// everyone else waits — held on blank paper by index.html — for the verdict.
if (cachedGateState() === 'open') {
  render(false);
  void resolveGateState().then((state) => {
    if (state === 'gated') render(true);
  });
} else {
  void resolveGateState().then((state) => render(state === 'gated'));
}
