import { HiCheck, HiX } from "react-icons/hi";

interface AccessoryItemData {
  accessory: { name: string };
  isIncluded: boolean;
  description?: string | null;
}

export function AccessoryList({ accessories }: { accessories: AccessoryItemData[] }) {
  if (!accessories?.length) return <p className="text-sm text-gray-400">未填写配件信息</p>;

  return (
    <ul className="space-y-1.5">
      {accessories.map((acc, i) => (
        <li key={i} className="flex items-center gap-2 text-sm">
          {acc.isIncluded ? (
            <HiCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
          ) : (
            <HiX className="h-4 w-4 flex-shrink-0 text-red-400" />
          )}
          <span className={acc.isIncluded ? "text-gray-700" : "text-gray-400 line-through"}>
            {acc.accessory.name}
          </span>
          {acc.description && <span className="text-xs text-gray-400">({acc.description})</span>}
        </li>
      ))}
    </ul>
  );
}
