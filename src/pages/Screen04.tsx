import { useState } from "react";
import { useLocation } from "wouter";

const weeks = [
  { id: "4w", label: "4 weeks", bg: "bg-green-100 text-green-800" },
  { id: "8w", label: "8 weeks", bg: "bg-purple-100 text-purple-800" },
  { id: "12w", label: "12 weeks", bg: "bg-blue-100 text-blue-800" },
  { id: "16w", label: "16 weeks", bg: "bg-orange-100 text-orange-800" },
  { id: "custom", label: "Custom", bg: "bg-yellow-100 text-yellow-800" },
];

export default function Screen04() {
  const [goalWeight, setGoalWeight] = useState(80);
  const [maintain, setMaintain] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const canContinue = selectedWeek !== null;

  const handleContinue = () => {
    if (canContinue) {
      localStorage.setItem("onboarding_goal_weight", String(goalWeight));
      localStorage.setItem("onboarding_timeline", selectedWeek);
      navigate("/activity");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-yellow-50 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-6 shadow mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">What's your goal weight</h1>
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl font-extrabold text-gray-900">{goalWeight}</span>
              <span className="border border-gray-200 rounded-full px-3 py-1 text-gray-500 text-sm font-medium bg-white">kg</span>
            </div>
            <input
              type="range"
              min={40}
              max={150}
              value={goalWeight}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
              className="w-full accent-blue-400 h-1"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setMaintain(!maintain)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintain ? "bg-green-400" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${maintain ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
              <span className="text-gray-700 font-medium">Maintain</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow relative" style={{ paddingBottom: 96 }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">How fast do you want to achieve it?</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {weeks.slice(0, 3).map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWeek(w.id)}
                className={`py-2 px-3 rounded-full font-semibold text-sm transition-all ${w.bg} ${selectedWeek === w.id ? "ring-2 ring-gray-400" : ""}`}
              >
                {w.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2 mb-6">
            {weeks.slice(3).map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWeek(w.id)}
                className={`py-2 px-4 rounded-full font-semibold text-sm transition-all ${w.bg} ${selectedWeek === w.id ? "ring-2 ring-gray-400" : ""}`}
              >
                {w.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleContinue}
            className={`w-full py-4 rounded-full font-semibold text-base transition-colors ${canContinue ? "bg-green-400 hover:bg-green-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Continue
          </button>
          <img
            src="/assets/goku3.png"
            alt="Goku"
            style={{ position: "absolute", bottom: 8, right: 8, width: 108, height: "auto", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
