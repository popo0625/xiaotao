import { Badge } from "@/components/ui/Badge";

const gradeConfig: Record<string, { variant: "success" | "info" | "warning" | "danger" | "default"; label: string }> = {
  "全新": { variant: "success", label: "全新" },
  "几乎全新": { variant: "info", label: "几乎全新" },
  "良好": { variant: "default", label: "良好" },
  "一般": { variant: "warning", label: "一般" },
  "有瑕疵": { variant: "danger", label: "有瑕疵" },
};

export function GradeBadge({ grade }: { grade: string }) {
  const config = gradeConfig[grade] || { variant: "default" as const, label: grade };
  return <Badge variant={config.variant as any}>{config.label}</Badge>;
}

export function GradeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const grades = [
    { value: "全新", label: "全新", desc: "全新未使用，原包装完好" },
    { value: "几乎全新", label: "几乎全新", desc: "使用过一两次，无明显痕迹" },
    { value: "良好", label: "良好", desc: "正常使用痕迹，功能完好" },
    { value: "一般", label: "一般", desc: "较多使用痕迹，不影响功能" },
    { value: "有瑕疵", label: "有瑕疵", desc: "有明显损坏或功能缺陷" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {grades.map((g) => (
        <button
          key={g.value}
          type="button"
          onClick={() => onChange(g.value)}
          className={`rounded-lg border p-3 text-left transition-all ${
            value === g.value
              ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-medium text-sm">{g.label}</div>
          <div className="mt-0.5 text-xs text-gray-500">{g.desc}</div>
        </button>
      ))}
    </div>
  );
}
