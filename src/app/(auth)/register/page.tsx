import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 text-center">注册</h1>
      <p className="mt-2 text-sm text-gray-500 text-center">
        加入校淘，开始校园交易
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        已有账号？{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          立即登录
        </Link>
      </p>
    </>
  );
}
