"use client";

interface ConnectProgressBarProps {
  connectedCount: number;
  totalCount: number;
}

export function ConnectProgressBar({
  connectedCount,
  totalCount,
}: ConnectProgressBarProps) {
  const percentage = totalCount > 0 ? (connectedCount / totalCount) * 100 : 0;
  const isAllConnected = connectedCount === totalCount && totalCount > 0;
  const isNoneConnected = connectedCount === 0;

  let labelText = `${connectedCount} of ${totalCount} tools connected`;
  if (isNoneConnected) {
    labelText = "Connect at least 1 tool to continue";
  } else if (isAllConnected) {
    labelText = "All tools connected! 🎉";
  }

  return (
    <div className="w-full space-y-2.5 max-w-xl mx-auto select-none">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-white/70">
          {labelText}
        </span>
        <span className="font-mono text-white/50">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/[0.03] p-[1px]">
        <div
          className="h-full rounded-full bg-[#1D9E75] shadow-[0_0_12px_rgba(29,158,117,0.4)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
