import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

// 用 Suspense 包裹共享认证表单，因为表单读取 URL 查询参数。
// Wrap the shared auth form in Suspense because it reads URL search parameters.
export default function LoginPage() {
  return (
    <main className="shell">
      <div className="container">
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </main>
  );
}
