import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AvatarDisplay } from "@/components/user/AvatarDisplay";
import { formatDate } from "@/lib/utils";

interface SellerInfo {
  id: string;
  name: string;
  avatar: string | null;
  studentIdVerified?: boolean;
  location?: string | null;
  createdAt?: string;
}

export function SellerInfoCard({ seller }: { seller: SellerInfo }) {
  return (
    <Link
      href={`/profile/${seller.id}`}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-200"
    >
      <AvatarDisplay src={seller.avatar} name={seller.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{seller.name}</span>
          {seller.studentIdVerified && <Badge variant="success">学生认证</Badge>}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
          {seller.location && <span>{seller.location}</span>}
          {seller.createdAt && <span>加入 {formatDate(seller.createdAt)}</span>}
        </div>
      </div>
    </Link>
  );
}
