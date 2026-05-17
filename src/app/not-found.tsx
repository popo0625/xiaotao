export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg text-gray-600">页面未找到</p>
      <a href="/" className="mt-6 text-sm text-blue-600 hover:underline">
        返回首页
      </a>
    </div>
  );
}
