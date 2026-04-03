import { useState } from "react";
import { useLocation } from "wouter";

const goals = [
  { id: "lose-fat", emoji: "🔥", label: "Lose Fat", bg: "bg-green-100" },
  { id: "gain-muscle", emoji: "💪", label: "Gain Muscle", bg: "bg-yellow-100" },
  { id: "maintain", emoji: "⚖️", label: "Maintain Weight", bg: "bg-blue-100" },
];

export default function Screen02() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const handleContinue = () => {
    if (selected) {
      localStorage.setItem("onboarding_primary_goal", selected);
      navigate("/body-stats");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">What is your primary goal?</h1>
        <div className="flex flex-col gap-4 mb-8">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left font-bold text-gray-900 text-base transition-all ${g.bg} ${selected === g.id ? "ring-2 ring-green-400" : ""}`}
            >
              <span className="text-2xl">{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-semibold text-base transition-colors ${selected ? "bg-green-400 hover:bg-green-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          Continue
        </button>
        <img
          src="/assets/goku1.png"
          alt="Goku"
          style={{ position: "absolute", bottom: 8, right: 8, width: 108, height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
