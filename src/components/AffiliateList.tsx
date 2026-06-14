import { Affiliate } from "../api/endpoints";
import { Badge } from "./ui/Badge";
import { HealthBar } from "./ui/HealthBar";

interface AffiliateListProps {
  affiliates: Affiliate[];
  selected: Affiliate | null;
  onSelect: (a: Affiliate) => void;
}

export function AffiliateList({ affiliates, selected, onSelect }: AffiliateListProps) {
  if (affiliates.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-400 text-center mt-8">
        No affiliates found
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {affiliates.map((a) => (
        <li key={a.id}>
          <button
            onClick={() => onSelect(a)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
              selected?.id === a.id ? "bg-primary-50 border-l-2 border-primary-500" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-900 truncate pr-2">{a.name}</span>
              <Badge status={a.status} />
            </div>
            <HealthBar score={a.health_score} />
            <p className="text-xs text-gray-400 mt-1.5">
              Last contact: {a.days_since_contact}d ago
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}