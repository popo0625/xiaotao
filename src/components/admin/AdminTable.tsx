import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyState?: { title: string; description?: string; action?: React.ReactNode };
  onRowClick?: (item: T) => void;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  loading,
  emptyState,
  onRowClick,
}: AdminTableProps<T>) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyState?.title || "暂无数据"}
        description={emptyState?.description}
        action={emptyState?.action}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((item, i) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`${onRowClick ? "cursor-pointer" : ""} ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              } hover:bg-gray-50 transition-colors`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className || ""}`}>
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
