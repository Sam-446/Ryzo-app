import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const [, navigate] = useLocation();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await signUp(email, password, name);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    // After signup — go to onboarding start
    navigate("/goal");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)" }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
        <div className="text-center mb-8">
          <img
            src="/assets/goku_main.png"
            alt="Goku"
            className="mx-auto mb-4"
            style={{ width: 80 }}
          />
          <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Start your fitness journey</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-teal-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-4 rounded-full font-semibold text-base bg-teal-400 hover:bg-teal-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-teal-500 font-semibold"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
