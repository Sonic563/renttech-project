import { useEffect, useMemo, useRef, useState } from 'react';
import './ModalSelect.css';


export default function ModalSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) || options[0],
    [value, options],
  );

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="modalSelect" ref={ref}>
      <button
        type="button"
        className="modalSelectButton"
        onClick={() => setOpen((s) => !s)}
      >
        <span>{selected?.label ?? '-'}</span>
        <span className={`modalSelectChevron ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="modalSelectMenu">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`modalSelectItem ${o.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}