import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="shell">
      <div className="container">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
