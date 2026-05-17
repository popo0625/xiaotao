import { HiExclamationCircle } from "react-icons/hi";

interface FlawData {
  description: string;
  severity: string;
  imageUrl?: string | null;
}

export function FlawList({ flaws }: { flaws: FlawData[] }) {
  if (!flaws?.length) return null;

  return (
    <div>
      <h4 className="mb-2 text-sm font-medium text-gray-700">瑕疵说明</h4>
      <ul className="space-y-1.5">
        {flaws.map((flaw, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <HiExclamationCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
              flaw.severity === "major" ? "text-red-500" : "text-yellow-500"
            }`} />
            <div>
              <span className={flaw.severity === "major" ? "text-red-700" : "text-yellow-700"}>
                {flaw.description}
              </span>
              <span className="ml-1 text-xs text-gray-400">
                {flaw.severity === "major" ? "【严重】" : "【轻微】"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
