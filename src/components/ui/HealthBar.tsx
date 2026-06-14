interface HealthBarProps {
  score: number;
}

function barColor(score: number): string {
  if (score < 40) return "bg-red-500";
  if (score < 60) return "bg-amber-500";
  return "bg-green-500";
}

export function HealthBar({ score }: HealthBarProps) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-7 text-right tabular-nums">{Math.round(clamped)}</span>
    </div>
  );
}