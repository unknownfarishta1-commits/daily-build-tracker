import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Github, Mail, Lock } from "lucide-react";
import { useAppState } from "@/lib/challenge-state";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setSocialLoading(provider);
    setError("");
    try {
      await login(`demo+${provider}@abtalks.dev`, `demo123`);
      toast.success(`Signed in with ${provider === "github" ? "GitHub" : "Google"}`, {
        description: "Welcome back to ABTalks!",
      });
      navigate({ to: "/dashboard" });
    } catch {
      toast.info(`${provider === "github" ? "GitHub" : "Google"} OAuth`, {
        description: "Social login coming soon. Using demo access instead.",
      });
      try {
        await login("demo@abtalks.dev", "demo123");
        navigate({ to: "/dashboard" });
      } catch (fallbackErr) {
        setError(fallbackErr instanceof ApiError ? fallbackErr.message : "Login failed.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-50" />
      
      <Card className="w-full max-w-md border-border/40 bg-[#0d0d0f]/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl relative">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/20">
              <Logo className="h-8" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to continue your 60-day challenge
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="name@university.edu"
                  className="pl-10 bg-secondary/50 border-border/40 rounded-xl focus:border-primary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password Recovery", {
                      description: "This feature is coming soon. Please use the demo login for now.",
                    });
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-secondary/50 border-border/40 rounded-xl focus:border-primary/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive text-center">
                {error}
              </p>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d0d0f] px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="rounded-xl border-border/40 hover:bg-secondary h-11"
              onClick={() => handleSocialLogin("github")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "github" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-border/40 hover:bg-secondary h-11"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "google" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Sign Up", {
                  description: "Public signups opening soon. Use demo login: demo@abtalks.dev / demo123",
                });
              }}
              className="text-primary font-semibold hover:underline"
            >
              Sign up for free
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
