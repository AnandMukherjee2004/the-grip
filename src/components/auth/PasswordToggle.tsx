"use client";

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 3l18 18M10.5 10.7A3 3 0 0012 15a3 3 0 002.3-1M7.2 7.2C5.4 8.4 4 10 3 12c1.5 3 5 6 9 6 1.6 0 3.1-.4 4.4-1.1M14 5.2C13.4 5.1 12.7 5 12 5 8 5 4.5 8 3 12c.5 1 1.2 1.9 2 2.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M2 12C3.5 9 7 6 12 6s8.5 3 10 6c-1.5 3-5 6-10 6S3.5 15 2 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}

export { PasswordToggle };
