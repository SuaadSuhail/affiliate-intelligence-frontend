interface BadgeProps {
  status: "active" | "at_risk" | "churned" | "high_growth";
}

const config = {
  active:      { label: "Active",      classes: "bg-green-100 text-green-800"  },
  at_risk:     { label: "At Risk",     classes: "bg-amber-100 text-amber-800"  },
  churned:     { label: "Churned",     classes: "bg-red-100 text-red-800"      },
  high_growth: { label: "High Growth", classes: "bg-blue-100 text-blue-800"    },
};

export function Badge({ status }: BadgeProps) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}