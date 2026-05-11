import { useLocation } from "wouter";
import { useState } from "react";

export default function Screen01() {
  const [, navigate] = useLocation();
  const [showAppleToast, setShowAppleToast] = useState(false);

  const handleAppleClick = () => {
    setShowAppleToast(true);
    setTimeout(() => setShowAppleToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-green-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6">
        <img
          src="/assets/goku_main.png"
          alt="Goku"
          style={{ width: 190, height: "auto", objectFit: "contain", flexShrink: 0 }}
        />
        <p className="text-center text-xl font-bold text-gray-900 leading-snug">
          Transform your body, your vibe, and your confidence and increase your aura.
        </p>

        <div className="w-full flex flex-col gap-3">

          {/* Sign Up — light purple */}
          <button
            onClick={() => navigate("/signup")}
            className="w-full flex items-center justify-center gap-3 font-semibold py-4 rounded-full text-base transition-colors"
            style={{ background: "#e9d5ff", color: "#6b21a8" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Create Account
          </button>

          {/* Apple — Coming Soon */}
          <button
            onClick={handleAppleClick}
            className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold py-4 rounded-full text-base transition-colors relative"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
            <span className="ml-2 text-xs bg-white text-black px-2 py-0.5 rounded-full font-bold">Soon</span>
          </button>

          {/* Log In */}
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-600 font-medium py-4 rounded-full text-base hover:bg-purple-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Already have an account? Log in
          </button>
        </div>

        {/* Apple Coming Soon Toast */}
        {showAppleToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50">
            Apple Sign In coming soon 🍎
          </div>
        )}
      </div>
    </div>
  );
}
