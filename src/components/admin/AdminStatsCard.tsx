import { Card } from "@/components/ui/Card";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; isUp: boolean };
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const VARIANT_STYLES = {
  default: "bg-blue-100 text-blue-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-yellow-100 text-yellow-600",
  danger: "bg-red-100 text-red-600",
  info: "bg-indigo-100 text-indigo-600",
};

export function AdminStatsCard({ title, value, icon, trend, variant = "default" }: AdminStatsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs ${trend.isUp ? "text-green-600" : "text-red-600"}`}>
              {trend.isUp ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${VARIANT_STYLES[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
