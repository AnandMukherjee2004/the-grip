"use client";

import { useEffect, useId, useRef, useState } from "react";

export type CustomSelectOption = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

function useAnchoredPanel(open: boolean, triggerRef: React.RefObject<HTMLElement | null>) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const update = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const panelWidth = Math.max(rect.width, 220);
      const maxHeight = 280;
      const gap = 6;

      let left = rect.left;
      left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));

      const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
      const spaceAbove = rect.top - gap - 8;
      const openUp = spaceBelow < maxHeight && spaceAbove > spaceBelow;

      setStyle({
        position: "fixed",
        left,
        width: panelWidth,
        top: openUp ? undefined : rect.bottom + gap,
        bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
        maxHeight: Math.min(maxHeight, openUp ? spaceAbove : spaceBelow),
        zIndex: 60,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, triggerRef]);

  return style;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  className = "",
  id,
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const panelStyle = useAnchoredPanel(open, triggerRef);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`custom-select ${className}`.trim()}>
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? selected?.label ?? placeholder}
        onClick={() => setOpen((prev) => !prev)}
        className="custom-select__trigger"
      >
        <span className={`custom-select__value${selected ? "" : " is-placeholder"}`}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`custom-select__chevron${open ? " is-open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="custom-select__backdrop" onClick={() => setOpen(false)} />
          <div
            className="custom-select__menu"
            style={panelStyle}
            role="listbox"
            aria-labelledby={selectId}
          >
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`custom-select__option${isActive ? " is-active" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isActive && <span className="custom-select__check" aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
