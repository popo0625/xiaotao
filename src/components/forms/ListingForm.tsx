"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { ListingStepBasic } from "./ListingStepBasic";
import { ListingStepMedia } from "./ListingStepMedia";
import { ListingStepCondition } from "./ListingStepCondition";
import { ListingStepPrice } from "./ListingStepPrice";

const STEPS = ["基本信息", "上传图片", "成色配件", "价格发布"];

interface Category {
  id: number;
  displayName: string;
}

interface AccessoryItem {
  id: number;
  name: string;
  isRequired: boolean;
}

interface Flaw {
  description: string;
  severity: "minor" | "major";
  imageUrl?: string;
}

interface ImageItem {
  url: string;
  sortOrder: number;
  type: string;
}

interface Props {
  productId?: string;
}

export function ListingForm({ productId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(!!productId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accessoryItems, setAccessoryItems] = useState<AccessoryItem[]>([]);

  const [basicData, setBasicData] = useState({
    title: "",
    categoryId: "",
    brand: "",
    description: "",
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [grade, setGrade] = useState("");
  const [accessories, setAccessories] = useState<{ accessoryId: number; isIncluded: boolean }[]>([]);
  const [flaws, setFlaws] = useState<Flaw[]>([]);
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [isShippingIncluded, setIsShippingIncluded] = useState(false);
  const [shippingLocation, setShippingLocation] = useState("");
  const [sellerType, setSellerType] = useState("个人卖家");

  const isEditing = !!productId;

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/accessory-items").then((r) => r.json()).then(setAccessoryItems).catch(() => {});
  }, []);

  // Load existing product data when editing
  useEffect(() => {
    if (!productId) return;

    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setBasicData({
          title: data.title || "",
          categoryId: data.categoryId?.toString() || "",
          brand: data.brand || "",
          description: data.description || "",
        });
        setImages(data.images || []);
        setGrade(data.grade || "");
        setAccessories(
          (data.accessories || []).map((a: any) => ({
            accessoryId: a.accessoryId,
            isIncluded: a.isIncluded,
          }))
        );
        setFlaws(data.flaws || []);
        setPrice(data.price?.toString() || "");
        setOriginalPrice(data.originalPrice?.toString() || "");
        setIsShippingIncluded(data.isShippingIncluded || false);
        setShippingLocation(data.shippingLocation || "");
        setSellerType(data.sellerType || "个人卖家");
      })
      .catch(() => toast.error("加载商品信息失败"))
      .finally(() => setLoadingProduct(false));
  }, [productId]);

  const canProceed = () => {
    switch (step) {
      case 0: return basicData.title.trim().length >= 2 && basicData.categoryId;
      case 1: return images.length > 0;
      case 2: return !!grade;
      case 3: return parseFloat(price) > 0;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const body = {
        ...basicData,
        categoryId: parseInt(basicData.categoryId),
        images,
        grade,
        accessories,
        flaws,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        isShippingIncluded,
        shippingLocation,
        sellerType,
      };

      let res;
      if (isEditing) {
        res = await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || (isEditing ? "保存失败" : "发布失败"));
      }

      const product = await res.json();
      toast.success(isEditing ? "保存成功！" : "发布成功！");
      router.push(`/products/${product.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : (isEditing ? "保存失败" : "发布失败"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {i + 1}
              </div>
              <span className={`ml-2 text-sm ${i <= step ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className={`mx-4 h-px w-12 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      {step === 0 && <ListingStepBasic data={basicData} onChange={setBasicData} categories={categories} />}
      {step === 1 && <ListingStepMedia images={images} onChange={setImages} />}
      {step === 2 && (
        <ListingStepCondition
          grade={grade}
          onChangeGrade={setGrade}
          accessories={accessories}
          onChangeAccessories={setAccessories}
          flaws={flaws}
          onChangeFlaws={setFlaws}
          accessoryItems={accessoryItems}
        />
      )}
      {step === 3 && (
        <ListingStepPrice
          price={price}
          originalPrice={originalPrice}
          isShippingIncluded={isShippingIncluded}
          shippingLocation={shippingLocation}
          sellerType={sellerType}
          onChangePrice={setPrice}
          onChangeOriginalPrice={setOriginalPrice}
          onChangeShipping={setIsShippingIncluded}
          onChangeLocation={setShippingLocation}
          onChangeSellerType={setSellerType}
          preview={{ title: basicData.title, price, grade, images }}
        />
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          上一步
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {step === 0 && "请填写基本信息"}
            {step === 1 && "请上传至少一张商品图片"}
            {step === 2 && "请选择商品成色"}
            {step === 3 && "设置价格后提交"}
          </span>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              下一步
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} disabled={!canProceed()}>
              {isEditing ? "保存修改" : "发布商品"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
