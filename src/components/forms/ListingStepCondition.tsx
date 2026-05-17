"use client";

import { GradeSelector } from "@/components/products/GradeBadge";
import { HiPlus, HiX } from "react-icons/hi";

interface Flaw {
  description: string;
  severity: "minor" | "major";
  imageUrl?: string;
}

interface Props {
  grade: string;
  onChangeGrade: (v: string) => void;
  accessories: { accessoryId: number; isIncluded: boolean }[];
  onChangeAccessories: (accs: { accessoryId: number; isIncluded: boolean }[]) => void;
  flaws: Flaw[];
  onChangeFlaws: (flaws: Flaw[]) => void;
  accessoryItems: { id: number; name: string; isRequired: boolean }[];
}

export function ListingStepCondition({
  grade, onChangeGrade,
  accessories, onChangeAccessories,
  flaws, onChangeFlaws,
  accessoryItems,
}: Props) {
  const toggleAccessory = (id: number) => {
    const exists = accessories.find((a) => a.accessoryId === id);
    if (exists) {
      onChangeAccessories(accessories.filter((a) => a.accessoryId !== id));
    } else {
      onChangeAccessories([...accessories, { accessoryId: id, isIncluded: true }]);
    }
  };

  const toggleIncluded = (id: number) => {
    onChangeAccessories(
      accessories.map((a) => a.accessoryId === id ? { ...a, isIncluded: !a.isIncluded } : a)
    );
  };

  const addFlaw = () => {
    onChangeFlaws([...flaws, { description: "", severity: "minor" }]);
  };

  const updateFlaw = (index: number, field: keyof Flaw, value: string) => {
    const updated = [...flaws];
    (updated[index] as any)[field] = value;
    onChangeFlaws(updated);
  };

  const removeFlaw = (index: number) => {
    onChangeFlaws(flaws.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          商品成色 <span className="text-red-500">*</span>
        </label>
        <GradeSelector value={grade} onChange={onChangeGrade} />
      </div>

      {/* Accessories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">配件清单</label>
        <div className="space-y-2">
          {accessoryItems.map((item) => {
            const isSelected = accessories.find((a) => a.accessoryId === item.id);
            const isIncluded = isSelected?.isIncluded ?? false;
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                <input
                  type="checkbox"
                  checked={!!isSelected}
                  onChange={() => toggleAccessory(item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="flex-1 text-sm">{item.name}</span>
                {item.isRequired && <span className="text-xs text-gray-400">建议填写</span>}
                {isSelected && (
                  <button
                    type="button"
                    onClick={() => toggleIncluded(item.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      isIncluded ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isIncluded ? "有" : "无"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flaws */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">瑕疵说明</label>
          <button
            type="button"
            onClick={addFlaw}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <HiPlus className="h-4 w-4" />
            添加瑕疵
          </button>
        </div>
        {flaws.length === 0 && (
          <p className="text-sm text-gray-400">暂无瑕疵说明（如有瑕疵请添加）</p>
        )}
        <div className="space-y-2">
          {flaws.map((flaw, index) => (
            <div key={index} className="flex items-start gap-2 rounded-lg border border-gray-200 p-3">
              <input
                type="text"
                value={flaw.description}
                onChange={(e) => updateFlaw(index, "description", e.target.value)}
                placeholder="瑕疵描述"
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
              <select
                value={flaw.severity}
                onChange={(e) => updateFlaw(index, "severity", e.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="minor">轻微</option>
                <option value="major">严重</option>
              </select>
              <button type="button" onClick={() => removeFlaw(index)} className="p-1 text-gray-400 hover:text-red-500">
                <HiX className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
