interface ScoreCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
}

export function ScoreCard({ title, value, subtitle, accent }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${accent ?? "text-gray-900"}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}