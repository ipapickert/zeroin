import { Target } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Target className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Bei zeroin anmelden
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Melde dich mit deinem Konto an, um fortzufahren.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
