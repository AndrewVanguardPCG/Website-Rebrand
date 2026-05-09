// ============================================================
// Tweaks Panel — palette, typeface, density, dark mode, hero copy
// Mounted automatically when toolbar toggle activates edit mode.
// ============================================================

const { useState, useEffect, useRef } = React;

const PALETTES = [
  { id: 'ivory',    name: 'Ivory & Navy',    swatch: ['#f5f1ea', '#0a2540', '#7a8471'] },
  { id: 'forest',   name: 'Forest',          swatch: ['#f0ebe2', '#0f3d2e', '#c19a4a'] },
  { id: 'charcoal', name: 'Charcoal',        swatch: ['#ebe6dc', '#1a1a1a', '#8b6f47'] },
  { id: 'midnight', name: 'Midnight',        swatch: ['#f5f1ea', '#1c2434', '#5e7a8a'] },
];

const TYPEFACES = [
  { id: 'cormorant', name: 'Cormorant + Inter' },
  { id: 'playfair',  name: 'Playfair + Inter' },
  { id: 'fraunces',  name: 'Fraunces + DM Sans' },
  { id: 'optima',    name: 'Cormorant + Work Sans' },
];

function VPCGTweaks() {
  const defaults = window.__tweakDefaults || {};
  const initial = window.__tweakState || defaults;
  const [state, setState] = useState(initial);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const dragRef = useRef({ dragging: false, ox: 0, oy: 0 });
  const [pos, setPos] = useState({ right: 24, bottom: 24 });

  // Listen for host toggle
  useEffect(() => {
    function onMsg(e) {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode') setOpen(true);
      if (d.type === '__deactivate_edit_mode') setOpen(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Apply on change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', state.palette);
    root.setAttribute('data-typeface', state.typeface);
    root.setAttribute('data-density', state.density);
    root.setAttribute('data-theme', state.theme);
    try { localStorage.setItem('vpcg-tweaks', JSON.stringify(state)); } catch (e) {}
    window.__tweakState = state;

    // Update hero copy live
    const h1 = document.querySelector('[data-hero-headline]');
    const sub = document.querySelector('[data-hero-sub]');
    if (h1) {
      const em = (state.heroEm || '').trim();
      let html = state.heroHeadline || '';
      if (em && html.includes(em)) html = html.replace(em, `<em>${em}</em>`);
      h1.innerHTML = html;
    }
    if (sub) sub.textContent = state.heroSub || '';

    // Persist to source via host
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*');
  }, [state]);

  function update(k, v) { setState(s => ({ ...s, [k]: v })); }

  function close() {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  }

  function startDrag(e) {
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = {
      dragging: true,
      ox: e.clientX - rect.left,
      oy: e.clientY - rect.top,
    };
    e.preventDefault();
  }
  useEffect(() => {
    function onMove(e) {
      if (!dragRef.current.dragging) return;
      const x = e.clientX - dragRef.current.ox;
      const y = e.clientY - dragRef.current.oy;
      setPos({
        right: Math.max(8, window.innerWidth - x - panelRef.current.offsetWidth),
        bottom: Math.max(8, window.innerHeight - y - panelRef.current.offsetHeight),
      });
    }
    function onUp() { dragRef.current.dragging = false; }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  if (!open) return null;

  const panelStyle = {
    position: 'fixed',
    right: pos.right + 'px',
    bottom: pos.bottom + 'px',
    width: 340,
    maxHeight: '88vh',
    overflowY: 'auto',
    background: 'var(--bg)',
    color: 'var(--ink-2)',
    border: '1px solid var(--rule)',
    borderRadius: 12,
    boxShadow: '0 24px 60px rgba(10,37,64,0.18)',
    fontFamily: 'var(--font-sans)',
    zIndex: 99999,
  };

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: 8,
    display: 'block',
  };

  const sectionStyle = { padding: '18px 20px', borderTop: '1px solid var(--rule)' };

  return (
    <div ref={panelRef} style={panelStyle}>
      <div onMouseDown={startDrag} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'move', borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink)' }}>Tweaks</span>
        <button onClick={close} style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1, padding: 0 }} aria-label="Close">×</button>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Palette</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {PALETTES.map(p => (
            <button key={p.id}
              onClick={() => update('palette', p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                border: state.palette === p.id ? '1px solid var(--ink)' : '1px solid var(--rule)',
                borderRadius: 8,
                background: state.palette === p.id ? 'var(--paper)' : 'transparent',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', flexShrink: 0 }}>
                {p.swatch.map((c, i) => (
                  <span key={i} style={{ width: 12, height: 18, background: c, marginLeft: i ? -3 : 0, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2 }} />
                ))}
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink)' }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Typography</span>
        <select value={state.typeface} onChange={e => update('typeface', e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 6, fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)' }}
        >
          {TYPEFACES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Density</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, border: '1px solid var(--rule)', borderRadius: 999, padding: 3 }}>
          {['spacious', 'compact'].map(d => (
            <button key={d} onClick={() => update('density', d)}
              style={{
                padding: '8px 12px', borderRadius: 999, fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: state.density === d ? 'var(--ink)' : 'transparent',
                color: state.density === d ? 'var(--bg)' : 'var(--ink)',
              }}
            >{d}</button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Mode</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, border: '1px solid var(--rule)', borderRadius: 999, padding: 3 }}>
          {['light', 'dark'].map(m => (
            <button key={m} onClick={() => update('theme', m)}
              style={{
                padding: '8px 12px', borderRadius: 999, fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: state.theme === m ? 'var(--ink)' : 'transparent',
                color: state.theme === m ? 'var(--bg)' : 'var(--ink)',
              }}
            >{m}</button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <span style={labelStyle}>Hero Headline</span>
        <textarea value={state.heroHeadline} onChange={e => update('heroHeadline', e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 10, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 6, fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--ink)', resize: 'vertical' }}
        />
        <span style={{ ...labelStyle, marginTop: 12 }}>Italic Phrase</span>
        <input value={state.heroEm} onChange={e => update('heroEm', e.target.value)}
          placeholder="Word/phrase to italicize"
          style={{ width: '100%', padding: 10, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 6, fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)' }}
        />
        <span style={{ ...labelStyle, marginTop: 12 }}>Hero Sub</span>
        <textarea value={state.heroSub} onChange={e => update('heroSub', e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 10, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 6, fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)', resize: 'vertical' }}
        />
      </div>

      <div style={{ ...sectionStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setState(window.__tweakDefaults)}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}
        >Reset</button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--muted)' }}>VPCG · Live preview</span>
      </div>
    </div>
  );
}

(function mount() {
  const node = document.createElement('div');
  node.id = 'vpcg-tweaks-mount';
  document.body.appendChild(node);
  ReactDOM.createRoot(node).render(<VPCGTweaks />);
})();
