import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function normalizeAuthError(message = "") {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("email rate limit") ||
    lowerMessage.includes("rate limit") ||
    lowerMessage.includes("too many")
  ) {
    return "Supabase is still blocking signup emails. Please disable email confirmation for testing or wait for the project email limit to reset.";
  }

  if (lowerMessage.includes("invalid login")) {
    return "Invalid email or password.";
  }

  if (lowerMessage.includes("password")) {
    return message;
  }

  if (lowerMessage.includes("email")) {
    return message;
  }

  return message || "Something went wrong. Please try again.";
}

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export default function AuthPage() {
  const { signIn, signUp, authReady } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined;

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const blocked = loading || cooldownSeconds > 0;

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) return "Please enter your email.";
    if (!isValidEmail(cleanEmail)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (!isLogin && password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event?.preventDefault?.();

    if (blocked) return;

    resetMessages();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!authReady) {
      setError(
        "Supabase is not configured yet. Please check your project URL and publishable key."
      );
      return;
    }

    try {
      setLoading(true);

      const cleanEmail = email.trim();
      const action = isLogin ? signIn : signUp;
      const { data, error: authError } = await action(cleanEmail, password);

      if (authError) {
        const nextMessage = normalizeAuthError(authError.message);
        setError(nextMessage);

        if (
          authError.status === 429 ||
          nextMessage.toLowerCase().includes("rate") ||
          nextMessage.toLowerCase().includes("too many") ||
          nextMessage.toLowerCase().includes("blocking")
        ) {
          setCooldownSeconds(60);
        }

        return;
      }

      setCooldownSeconds(0);

      if (!isLogin) {
        setSuccess(
          data?.session
            ? "Account created. Welcome to CLARA."
            : "Account created. Please check your email if confirmation is required."
        );
      }
    } catch (err) {
      setError(normalizeAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = () => {
    if (loading) return;
    resetMessages();
    setCooldownSeconds(0);
    setIsLogin((current) => !current);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b10] px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
          CLARA
        </p>

        <h1 className="mt-2 text-xl font-black tracking-[-0.03em] text-white">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        <p className="mt-1 text-sm leading-6 text-white/45">
          {isLogin
            ? "Continue to your personal money coach."
            : "Start your secure CLARA account."}
        </p>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-[16px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20 focus:bg-white/[0.13]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="w-full rounded-[16px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20 focus:bg-white/[0.13]"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-400/15 bg-red-500/10 px-3 py-2 text-sm leading-5 text-red-300">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-sm leading-5 text-emerald-300">
            {success}
          </p>
        )}

        {cooldownSeconds > 0 && (
          <p className="mt-3 text-xs leading-5 text-white/40">
            Frontend cooldown: try again in {cooldownSeconds} seconds. If Supabase still blocks it after this, turn off email confirmation while testing.
          </p>
        )}

        <button
          type="submit"
          disabled={blocked}
          className="mt-5 w-full rounded-[16px] bg-white py-3 text-sm font-black text-black transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : cooldownSeconds > 0
              ? `Wait ${cooldownSeconds}s`
              : isLogin
                ? "Login"
                : "Create Account"}
        </button>

        <button
          type="button"
          onClick={handleModeToggle}
          disabled={loading}
          className="mt-4 text-left text-sm text-white/55 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLogin
            ? "No account yet? Create one"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
