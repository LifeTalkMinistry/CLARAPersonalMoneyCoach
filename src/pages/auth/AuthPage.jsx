import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const fn = isLogin ? signIn : signUp;
    const { error } = await fn(email, password);

    if (error) setError(error.message);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b10] text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

        <h1 className="text-xl font-semibold mb-4">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-xl bg-white/10 border border-white/10 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 rounded-xl bg-white/10 border border-white/10 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="mt-4 text-sm text-white/60 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "No account? Create one"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
