import { useState } from "react";
import { useLocation } from "wouter";

export default function Screen09() {
  const [motivation, setMotivation] = useState(0);
  const [, navigate] = useLocation();

  const handleContinue = () => {
    localStorage.setItem("onboarding_motivation_level", String(motivation));
    navigate("/plan-ready");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
          How motivated are you<br />to transform?
        </h1>
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-gray-400 text-sm">Just curious</span>
            <span className="text-pink-500 font-bold text-sm">All in!</span>
          </div>
          <div className="relative h-8 flex items-center">
            <div
              className="w-full h-3 rounded-full"
              style={{ background: "linear-gradient(to right, #facc15, #86efac, #f9a8d4)" }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={motivation}
              onChange={(e) => setMotivation(Number(e.target.value))}
              className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-300 border-4 border-yellow-400 rounded-full shadow-lg pointer-events-none"
              style={{ left: `calc(${motivation}% - 1rem)` }}
            />
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mb-8">
          Your vibe sets your journey.<br />
          Slide to choose your starting energy!
        </p>
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-full font-bold text-base bg-teal-300 hover:bg-teal-400 text-gray-900 transition-colors"
        >
          Continue
        </button>
        {/* Goku6 centered at the bottom of the card */}
        <div className="flex justify-center mt-6">
          <img
            src="/assets/goku6.png"
            alt="Goku"
            style={{ width: 140, height: "auto", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
