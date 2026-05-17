import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 text-center">登录</h1>
      <p className="mt-2 text-sm text-gray-500 text-center">
        欢迎回到校淘
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        还没有账号？{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          立即注册
        </Link>
      </p>
    </>
  );
}
