"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parseISODate, toISODate } from "@/lib/dateRange";

interface MiniCalendarProps {
  value?: string;
  onChange: (isoDate: string) => void;
  minDate?: string;
  maxDate?: string;
  compact?: boolean;
  rangeHighlight?: { start?: string; end?: string };
  label?: string;
  viewMonth?: Date;
  onViewMonthChange?: (month: Date) => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayTimestamp(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function normalizeRange(start?: string, end?: string) {
  if (!start || !end) return null;
  const a = dayTimestamp(parseISODate(start));
  const b = dayTimestamp(parseISODate(end));
  return { lo: Math.min(a, b), hi: Math.max(a, b) };
}

export default function MiniCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  compact = false,
  rangeHighlight,
  label,
  viewMonth: controlledViewMonth,
  onViewMonthChange,
}: MiniCalendarProps) {
  const selected = value ? parseISODate(value) : null;
  const min = minDate ? parseISODate(minDate) : undefined;
  const max = maxDate ? parseISODate(maxDate) : undefined;
  const range = normalizeRange(rangeHighlight?.start, rangeHighlight?.end);

  const [internalViewMonth, setInternalViewMonth] = useState(() =>
    startOfMonth(selected ?? new Date())
  );

  const viewMonth = controlledViewMonth ?? internalViewMonth;

  const setViewMonth = useCallback(
    (next: Date | ((prev: Date) => Date)) => {
      const resolved =
        typeof next === "function"
          ? next(controlledViewMonth ?? internalViewMonth)
          : next;
      const normalized = startOfMonth(resolved);
      if (onViewMonthChange) {
        onViewMonthChange(normalized);
      } else {
        setInternalViewMonth(normalized);
      }
    },
    [controlledViewMonth, internalViewMonth, onViewMonthChange]
  );

  useEffect(() => {
    if (controlledViewMonth) return;
    if (value) {
      setInternalViewMonth(startOfMonth(parseISODate(value)));
    }
  }, [value, controlledViewMonth]);

  const [focusedIso, setFocusedIso] = useState<string | null>(value ?? null);

  useEffect(() => {
    if (value) setFocusedIso(value);
  }, [value]);

  const monthLabel = viewMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const startPad = first.getDay();
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0
    ).getDate();

    const cells: Array<{ date: Date; inMonth: boolean } | null> = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d),
        inMonth: true,
      });
    }
    return cells;
  }, [viewMonth]);

  const selectableDays = useMemo(
    () =>
      days
        .filter((c): c is { date: Date; inMonth: boolean } => c !== null)
        .filter(({ date }) => {
          const time = dayTimestamp(date);
          if (min && time < dayTimestamp(min)) return false;
          if (max && time > dayTimestamp(max)) return false;
          return true;
        })
        .map(({ date }) => toISODate(date)),
    [days, min, max]
  );

  const isDisabled = (date: Date) => {
    const time = dayTimestamp(date);
    if (min && time < dayTimestamp(min)) return true;
    if (max && time > dayTimestamp(max)) return true;
    return false;
  };

  const getDayState = useCallback(
    (date: Date, iso: string) => {
      const time = dayTimestamp(date);
      const isSelected = selected ? isSameDay(date, selected) : false;
      const isToday = isSameDay(date, new Date());
      const isRangeStart =
        rangeHighlight?.start && iso === rangeHighlight.start;
      const isRangeEnd = rangeHighlight?.end && iso === rangeHighlight.end;
      const inRange =
        range !== null && time >= range.lo && time <= range.hi;
      return { isSelected, isToday, isRangeStart, isRangeEnd, inRange };
    },
    [selected, rangeHighlight, range]
  );

  const moveFocus = useCallback(
    (delta: number) => {
      if (selectableDays.length === 0) return;
      const current = focusedIso ?? selectableDays[0];
      let idx = selectableDays.indexOf(current);
      if (idx === -1) idx = 0;
      const next = selectableDays[Math.max(0, Math.min(selectableDays.length - 1, idx + delta))];
      setFocusedIso(next);
      setViewMonth(startOfMonth(parseISODate(next)));
    },
    [focusedIso, selectableDays]
  );

  const handleGridKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(-7);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(7);
        break;
      case "Enter":
      case " ":
        if (focusedIso) {
          event.preventDefault();
          onChange(focusedIso);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`mini-calendar ${compact ? "mini-calendar--compact" : ""}`}
      role="group"
      aria-label={label ?? "Calendar"}
    >
      {label && (
        <span className="mini-calendar__label">{label}</span>
      )}
      <div className="mini-calendar__header">
        <button
          type="button"
          className="mini-calendar__nav"
          aria-label="Previous month"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
        >
          ‹
        </button>
        <span className="mini-calendar__title">{monthLabel}</span>
        <button
          type="button"
          className="mini-calendar__nav"
          aria-label="Next month"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
        >
          ›
        </button>
      </div>

      <div className="mini-calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day} className="mini-calendar__weekday" aria-hidden="true">
            {day}
          </span>
        ))}
      </div>

      <div
        className="mini-calendar__grid"
        role="grid"
        aria-label={monthLabel}
        onKeyDown={handleGridKeyDown}
      >
        {days.map((cell, index) => {
          if (!cell) {
            return (
              <span key={`empty-${index}`} className="mini-calendar__cell" aria-hidden="true" />
            );
          }

          const { date } = cell;
          const iso = toISODate(date);
          const disabled = isDisabled(date);
          const { isSelected, isToday, isRangeStart, isRangeEnd, inRange } =
            getDayState(date, iso);
          const isFocused = focusedIso === iso;

          const classNames = [
            "mini-calendar__day",
            isSelected ? "is-selected" : "",
            isToday && !isSelected ? "is-today" : "",
            inRange && !isSelected ? "is-in-range" : "",
            isRangeStart ? "is-range-start" : "",
            isRangeEnd ? "is-range-end" : "",
            isFocused ? "is-focused" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              disabled={disabled}
              tabIndex={isFocused ? 0 : -1}
              aria-selected={isSelected}
              aria-label={date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              onFocus={() => setFocusedIso(iso)}
              onClick={() => {
                setFocusedIso(iso);
                onChange(iso);
              }}
              className={classNames}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
