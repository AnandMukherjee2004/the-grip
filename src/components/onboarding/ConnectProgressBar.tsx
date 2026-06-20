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
    labelText = "Connect at least 2 tools to continue";
  } else if (isAllConnected) {
    labelText = "All tools connected!";
  }

  return (
    <div className="w-full space-y-2.5 select-none">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-gray-700">{labelText}</span>
        <span className="font-mono text-gray-500">{Math.round(percentage)}%</span>
      </div>

      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 p-[1px]">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
