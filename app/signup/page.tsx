import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

// 以注册模式使用共享认证表单，Suspense 用于支持表单读取查询参数。
// Use the shared auth form in sign-up mode with Suspense for its search parameter access.
export default function SignupPage() {
  return (
    <main className="shell">
      <div className="container">
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </main>
  );
}
