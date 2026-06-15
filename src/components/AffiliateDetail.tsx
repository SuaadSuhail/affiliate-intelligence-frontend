import { useEffect, useState } from "react";
import type { Affiliate, ShapExplanation } from "../api/endpoints";
import { getShapExplanation } from "../api/endpoints";
import { Badge } from "./ui/Badge";
import { HealthBar } from "./ui/HealthBar";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface AffiliateDetailProps {
  affiliate: Affiliate;
}

function ShapBar({ label, value }: { label: string; value: number }) {
  const abs = Math.abs(value ?? 0);
  const pct = Math.min(100, (abs / 1) * 100);
  const color = value >= 0 ? "bg-red-400" : "bg-green-400";

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
        <span className="capitalize">{label.replace(/_/g, " ")}</span>
        <span className={`font-mono ${value >= 0 ? "text-red-600" : "text-green-600"}`}>
          {value >= 0 ? "+" : ""}{(value ?? 0).toFixed(3)}
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
  const [shapError, setShapError] = useState(false);

  useEffect(() => {
    setShap(null);
    setShapError(false);
    setLoading(true);
    getShapExplanation(affiliate.id)
      .then((r) => {
        if (r.data?.churn && r.data?.growth) {
          setShap(r.data);
        } else {
          setShapError(true);
        }
      })
      .catch(() => setShapError(true))
      .finally(() => setLoading(false));
  }, [affiliate.id]);

  const fmt = (n: number | undefined, decimals = 1) => (n ?? 0).toFixed(decimals);
  const fmtMoney = (n: number | undefined) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n ?? 0);

  const churnPct   = (affiliate.churn_risk_score ?? 0) * 100;
  const growthPct  = (affiliate.growth_potential_score ?? 0) * 100;
  const ctrTrend   = affiliate.ctr_trend_pct ?? 0;

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
          <HealthBar score={affiliate.health_score ?? 0} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Churn Risk</span>
            <span className="font-mono text-red-600">{fmt(churnPct)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 rounded-full" style={{ width: `${churnPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Growth Potential</span>
            <span className="font-mono text-green-600">{fmt(growthPct)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${growthPct}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Revenue 30d",        value: fmtMoney(affiliate.revenue_30d) },
          { label: "CTR Trend",          value: `${ctrTrend >= 0 ? "+" : ""}${fmt(ctrTrend)}%` },
          { label: "Days Since Contact", value: `${affiliate.days_since_contact ?? 0}d` },
          { label: "Last Contact",       value: affiliate.last_contact_at
              ? new Date(affiliate.last_contact_at).toLocaleDateString()
              : "—" },
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
        ) : shapError || !shap ? (
          <p className="text-xs text-gray-400 italic">SHAP explanation not available</p>
        ) : (
          <div className="space-y-4">
            {shap.churn?.top_factors?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-2">
                  Churn Risk Factors
                  <span className="text-gray-400 font-normal ml-1">
                    (prediction: {((shap.churn.prediction ?? 0) * 100).toFixed(1)}%)
                  </span>
                </p>
                {shap.churn.top_factors.slice(0, 5).map((f) => (
                  <ShapBar key={f.feature} label={f.feature} value={f.shap_value} />
                ))}
              </div>
            )}
            {shap.growth?.top_factors?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">
                  Growth Factors
                  <span className="text-gray-400 font-normal ml-1">
                    (prediction: {((shap.growth.prediction ?? 0) * 100).toFixed(1)}%)
                  </span>
                </p>
                {shap.growth.top_factors.slice(0, 5).map((f) => (
                  <ShapBar key={f.feature} label={f.feature} value={f.shap_value} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}