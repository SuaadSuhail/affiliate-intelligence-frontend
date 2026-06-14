import { useEffect, useState } from "react";
import { Affiliate, ShapExplanation, getShapExplanation } from "../api/endpoints";
import { Badge } from "./ui/Badge";
import { HealthBar } from "./ui/HealthBar";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface AffiliateDetailProps {
  affiliate: Affiliate;
}

function ShapBar({ label, value }: { label: string; value: number }) {
  const abs = Math.abs(value);
  const max = 1;
  const pct = Math.min(100, (abs / max) * 100);
  const color = value >= 0 ? "bg-red-400" : "bg-green-400";

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
        <span className="capitalize">{label.replace(/_/g, " ")}</span>
        <span className={`font-mono ${value >= 0 ? "text-red-600" : "text-green-600"}`}>
          {value >= 0 ? "+" : ""}{value.toFixed(3)}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function AffiliateDetail({ affiliate }: AffiliateDetailProps) {
  const [shap, setShap]       = useState<ShapExplanation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShap(null);
    setLoading(true);
    getShapExplanation(affiliate.id)
      .then((r) => setShap(r.data))
      .catch(() => setShap(null))
      .finally(() => setLoading(false));
  }, [affiliate.id]);

  const fmt = (n: number, decimals = 1) => n.toFixed(decimals);
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-gray-900 leading-tight">{affiliate.name}</h2>
          <Badge status={affiliate.status} />
        </div>
        <p className="text-xs text-gray-400 mt-1">ID: {affiliate.id}</p>
      </div>

      {/* Scores */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Health Score</p>
          <HealthBar score={affiliate.health_score} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Churn Risk</span>
            <span className="font-mono text-red-600">{fmt(affiliate.churn_risk_score * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-400 rounded-full"
              style={{ width: `${affiliate.churn_risk_score * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Growth Potential</span>
            <span className="font-mono text-green-600">{fmt(affiliate.growth_potential_score * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full"
              style={{ width: `${affiliate.growth_potential_score * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Revenue 30d",       value: fmtMoney(affiliate.revenue_30d) },
          { label: "CTR Trend",         value: `${affiliate.ctr_trend_pct >= 0 ? "+" : ""}${fmt(affiliate.ctr_trend_pct)}%` },
          { label: "Days Since Contact", value: `${affiliate.days_since_contact}d` },
          { label: "Last Contact",       value: new Date(affiliate.last_contact_at).toLocaleDateString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* SHAP explanation */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          AI Explanation
        </h3>
        {loading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : shap ? (
          <div className="space-y-4">
            {shap.risk_factors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-2">Risk Factors</p>
                {shap.risk_factors.slice(0, 5).map((f) => (
                  <ShapBar key={f.feature} label={f.feature} value={f.value} />
                ))}
              </div>
            )}
            {shap.growth_factors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">Growth Factors</p>
                {shap.growth_factors.slice(0, 5).map((f) => (
                  <ShapBar key={f.feature} label={f.feature} value={f.value} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No explanation available</p>
        )}
      </div>
    </div>
  );
}