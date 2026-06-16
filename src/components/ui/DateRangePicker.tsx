"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MiniCalendar from "@/components/ui/MiniCalendar";
import {
  DATE_RANGE_PRESETS,
  DEFAULT_DATE_RANGE,
  getDateRangeLabel,
  parseISODate,
  toISODate,
  type DateRangePreset,
  type DateRangeSelection,
} from "@/lib/dateRange";

interface DateRangePickerProps {
  value: DateRangeSelection;
  onChange: (value: DateRangeSelection) => void;
}

const PRESET_LABELS: Record<DateRangePreset, string> = {
  Today: "Today",
  "Last 7 days": "Last 7 Days",
  "Last 30 days": "Last 30 Days",
  "This month": "This Month",
};

type CustomMode = "date" | "range";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [customActive, setCustomActive] = useState(false);
  const [customMode, setCustomMode] = useState<CustomMode>("date");

  const today = toISODate(new Date());
  const [rangeStart, setRangeStart] = useState(value.customRangeStart ?? today);
  const [rangeEnd, setRangeEnd] = useState(value.customRangeEnd ?? today);
  const [singleDate, setSingleDate] = useState(value.customDate ?? today);
  const [startViewMonth, setStartViewMonth] = useState(() =>
    startOfMonth(parseISODate(value.customRangeStart ?? today))
  );
  const [endViewMonth, setEndViewMonth] = useState(() =>
    value.customRangeEnd
      ? startOfMonth(parseISODate(value.customRangeEnd))
      : addMonths(startOfMonth(parseISODate(value.customRangeStart ?? today)), 1)
  );
  const [rangeSelectionStep, setRangeSelectionStep] = useState<"start" | "end">("start");

  const displayLabel = getDateRangeLabel(value);
  const isCustomValue =
    value.kind === "custom-date" || value.kind === "custom-range";

  useEffect(() => setMounted(true), []);

  const closePanel = useCallback(() => {
    setOpen(false);
    setCustomActive(false);
    setCustomMode("date");
    triggerRef.current?.focus();
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    if (value.kind === "custom-date") {
      setCustomActive(true);
      setCustomMode("date");
    } else if (value.kind === "custom-range") {
      setCustomActive(true);
      setCustomMode("range");
      setStartViewMonth(startOfMonth(parseISODate(value.customRangeStart ?? today)));
      setEndViewMonth(
        startOfMonth(parseISODate(value.customRangeEnd ?? value.customRangeStart ?? today))
      );
      setRangeSelectionStep("start");
    } else {
      setCustomActive(false);
      setCustomMode("date");
    }
  }, [value.kind]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closePanel]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 50);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open]);

  const selectPreset = (preset: DateRangePreset) => {
    onChange({ kind: "preset", preset });
    setCustomActive(false);
    setOpen(false);
  };

  const selectCustom = () => {
    setCustomActive(true);
    setCustomMode("date");
  };

  const enterRangeMode = () => {
    setCustomMode("range");
    const startMonth = startOfMonth(parseISODate(rangeStart));
    setStartViewMonth(startMonth);
    setEndViewMonth(
      rangeStart === rangeEnd ? addMonths(startMonth, 1) : startOfMonth(parseISODate(rangeEnd))
    );
    setRangeSelectionStep("start");
  };

  const handleRangeDateSelect = (iso: string) => {
    if (rangeSelectionStep === "start") {
      setRangeStart(iso);
      setRangeEnd(iso);
      setRangeSelectionStep("end");
      return;
    }

    if (iso < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(iso);
    } else {
      setRangeEnd(iso);
    }
    setRangeSelectionStep("start");
  };

  const applyCustomRange = () => {
    const start = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
    onChange({ kind: "custom-range", customRangeStart: start, customRangeEnd: end });
    setOpen(false);
    setCustomActive(false);
  };

  const applyCustomDate = () => {
    onChange({ kind: "custom-date", customDate: singleDate });
    setOpen(false);
    setCustomActive(false);
  };

  const modalVariant = !customActive
    ? "presets"
    : customMode === "range"
      ? "range"
      : "date";

  const modal = open && mounted ? (
    <>
      <div
        className="date-picker__backdrop"
        onClick={closePanel}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Date filter"
        className={`date-picker__modal date-picker__modal--${modalVariant}`}
      >
        <div className="date-picker__layout">
          <aside className="date-picker__sidebar" aria-label="Quick presets">
            {DATE_RANGE_PRESETS.map((preset) => {
              const isActive =
                !customActive && value.kind === "preset" && value.preset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  className={`date-picker__preset${isActive ? " is-active" : ""}`}
                  onClick={() => selectPreset(preset)}
                >
                  {PRESET_LABELS[preset]}
                </button>
              );
            })}
            <button
              type="button"
              className={`date-picker__preset${customActive || isCustomValue ? " is-active" : ""}`}
              onClick={selectCustom}
            >
              Custom
            </button>
          </aside>

          <div className="date-picker__main">
            {!customActive ? (
              <div className="date-picker__empty">
                <p className="date-picker__empty-title">Choose a time period</p>
                <p className="date-picker__empty-text">
                  Select a preset on the left, or pick Custom for a specific date or range.
                </p>
              </div>
            ) : (
              <div className="date-picker__custom">
                <div className="date-picker__segment" role="tablist" aria-label="Custom date type">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={customMode === "date"}
                    className={`date-picker__segment-btn${customMode === "date" ? " is-active" : ""}`}
                    onClick={() => setCustomMode("date")}
                  >
                    Date
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={customMode === "range"}
                    className={`date-picker__segment-btn${customMode === "range" ? " is-active" : ""}`}
                    onClick={enterRangeMode}
                  >
                    Date Range
                  </button>
                </div>

                <div className="date-picker__body">
                  {customMode === "date" && (
                    <div className="date-picker__single-cal">
                      <MiniCalendar value={singleDate} onChange={setSingleDate} />
                    </div>
                  )}

                  {customMode === "range" && (
                    <div className="date-picker__dual-cal">
                      <MiniCalendar
                        label="Start"
                        value={rangeStart}
                        onChange={handleRangeDateSelect}
                        rangeHighlight={{ start: rangeStart, end: rangeEnd }}
                        viewMonth={startViewMonth}
                        onViewMonthChange={setStartViewMonth}
                      />
                      <MiniCalendar
                        label="End"
                        value={rangeEnd}
                        onChange={handleRangeDateSelect}
                        rangeHighlight={{ start: rangeStart, end: rangeEnd }}
                        viewMonth={endViewMonth}
                        onViewMonthChange={setEndViewMonth}
                      />
                    </div>
                  )}
                </div>

                <footer className="date-picker__footer">
                  <button
                    type="button"
                    className="date-picker__apply"
                    onClick={customMode === "date" ? applyCustomDate : applyCustomRange}
                  >
                    {customMode === "date" ? "Apply Date" : "Apply Range"}
                  </button>
                </footer>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="date-picker">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        className="date-picker__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Date filter: ${displayLabel}`}
      >
        <svg
          className="date-picker__icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="date-picker__label">{displayLabel}</span>
        <svg
          className={`date-picker__chevron${open ? " is-open" : ""}`}
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

      {mounted && modal ? createPortal(modal, document.body) : null}
    </div>
  );
}

export { DEFAULT_DATE_RANGE };
export type { DateRangeSelection };
