import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="shell">
      <div className="container">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
