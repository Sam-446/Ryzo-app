import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
export default function SignupScreen() {
  const [, navigate] = useLocation();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/goal"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-green-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6">
        <img
          src="/assets/goku_main.png"
          alt="Goku"
          style={{ width: 120, height: "auto", objectFit: "contain" }}
        />
        <div className="w-full text-center">
          <p className="text-2xl font-bold text-gray-900">Start your journey</p>
          <p className="text-gray-400 text-sm mt-1">Create your free account</p>
        </div>

        {success ? (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-4 rounded-2xl text-center font-medium">
            ✓ Account created! Starting your onboarding…
          </div>
        ) : (
          <form onSubmit={handleSignup} className="w-full flex flex-col gap-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-2xl text-center">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full border-2 border-gray-200 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border-2 border-gray-200 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full border-2 border-gray-200 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-full text-base transition-colors mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate("/login")}
          className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          Already have an account? <span className="font-semibold text-purple-500">Log in</span>
        </button>
      </div>
    </div>
  );
}
