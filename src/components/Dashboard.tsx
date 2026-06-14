import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Affiliate, Dashboard as DashboardData } from "../api/endpoints";
import { ScoreCard } from "./ui/ScoreCard";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface DashboardProps {
  affiliates: Affiliate[];
  dashboard: DashboardData | null;
  loading: boolean;
}

function barFill(score: number): string {
  if (score < 40) return "#dc2626";
  if (score < 60) return "#d97706";
  return "#16a34a";
}

export function Dashboard({ affiliates, dashboard, loading }: DashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sorted = [...affiliates].sort((a, b) => b.health_score - a.health_score);
  const chartData = sorted.map((a) => ({
    name: a.name.split(" ")[0],
    score: Math.round(a.health_score),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Total Affiliates"
          value={dashboard?.total_affiliates ?? affiliates.length}
        />
        <ScoreCard
          title="Avg Health Score"
          value={dashboard ? Math.round(dashboard.avg_health_score) : "—"}
          subtitle="out of 100"
        />
        <ScoreCard
          title="High Risk"
          value={dashboard?.high_risk_count ?? "—"}
          accent="text-red-600"
          subtitle="need attention"
        />
        <ScoreCard
          title="High Growth"
          value={dashboard?.high_growth_count ?? "—"}
          accent="text-green-600"
          subtitle="opportunity"
        />
      </div>

      {/* Health score chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Affiliate Health Scores</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => [v, "Health Score"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={barFill(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Additional stats */}
      {dashboard && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <ScoreCard
            title="Avg Churn Risk"
            value={`${Math.round(dashboard.avg_churn_risk * 100)}%`}
            accent="text-red-500"
          />
          <ScoreCard
            title="Avg Growth Potential"
            value={`${Math.round(dashboard.avg_growth_potential * 100)}%`}
            accent="text-green-500"
          />
          <ScoreCard
            title="Score History"
            value={dashboard.score_history_entries}
            subtitle="data points"
          />
        </div>
      )}
    </div>
  );
}