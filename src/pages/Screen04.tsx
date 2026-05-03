import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const weeks = [
  { id: "4w", label: "4 weeks", bg: "bg-green-100" },
  { id: "8w", label: "8 weeks", bg: "bg-purple-100" },
  { id: "12w", label: "12 weeks", bg: "bg-blue-100" },
  { id: "16w", label: "16 weeks", bg: "bg-orange-100" },
  { id: "custom", label: "Custom", bg: "bg-yellow-100" },
];

function getRecommendedWeek(goal: string, currentWeight: number, goalWeight: number): string {
  const diff = Math.abs(currentWeight - goalWeight);
  if (goal === "maintain") return "4w";
  if (diff <= 2) return "4w";
  if (diff <= 4) return "8w";
  if (diff <= 8) return "12w";
  return "16w";
}

export default function Screen04() {
  const [goalWeight, setGoalWeight] = useState(70);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [goal, setGoal] = useState("maintain");
  const [currentWeight, setCurrentWeight] = useState(70);
  const [recommendedWeek, setRecommendedWeek] = useState("8w");
  const [, navigate] = useLocation();

  useEffect(() => {
    const savedGoal = localStorage.getItem("onboarding_primary_goal") || "maintain";
    const savedWeight = parseFloat(localStorage.getItem("onboarding_current_weight") || "70");

    setGoal(savedGoal);
    setCurrentWeight(savedWeight);

    let defaultGoalWeight = savedWeight;
    if (savedGoal === "fat_loss") defaultGoalWeight = Math.round(savedWeight - 5);
    else if (savedGoal === "muscle_gain") defaultGoalWeight = Math.round(savedWeight + 3);

    setGoalWeight(defaultGoalWeight);

    const recommended = getRecommendedWeek(savedGoal, savedWeight, defaultGoalWeight);
    setRecommendedWeek(recommended);
    setSelectedWeek(recommended);
  }, []);

  useEffect(() => {
    const recommended = getRecommendedWeek(goal, currentWeight, goalWeight);
    setRecommendedWeek(recommended);
  }, [goalWeight, goal, currentWeight]);

  const handleContinue = () => {
    if (!selectedWeek) return;
    localStorage.setItem("onboarding_goal_weight", String(goalWeight));
    localStorage.setItem("onboarding_timeline", selectedWeek);
    navigate("/activity");
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center p-4 pt-8"
      style={{
        background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #e8fff7 100%)",
      }}
    >
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Goal weight card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
            What's your goal weight?
          </h1>
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl font-extrabold text-gray-900">
                {goalWeight}
              </span>
              <span className="border border-gray-200 rounded-full px-3 py-1 text-gray-500 text-sm font-medium bg-white">
                kg
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={150}
              value={goalWeight}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
              className="w-full accent-teal-400 h-1"
            />
          </div>
        </div>

        {/* Timeline card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            How fast do you want to get there?
          </h2>

          <div className="grid grid-cols-3 gap-2 mb-2">
            {weeks.slice(0, 3).map((w) => (
              <div key={w.id} className="relative">
                <button
                  onClick={() => setSelectedWeek(w.id)}
                  className={`w-full py-2 px-3 rounded-full font-semibold text-sm transition-all ${w.bg} ${
                    selectedWeek === w.id ? "ring-2 ring-gray-400" : ""
                  }`}
                >
                  {w.label}
                </button>
                {recommendedWeek === w.id && (
                  <span className="absolute -top-2 -right-1 bg-teal-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mb-3">
            {weeks.slice(3).map((w) => (
              <div key={w.id} className="relative">
                <button
                  onClick={() => setSelectedWeek(w.id)}
                  className={`py-2 px-4 rounded-full font-semibold text-sm transition-all ${w.bg} ${
                    selectedWeek === w.id ? "ring-2 ring-gray-400" : ""
                  }`}
                >
                  {w.label}
                </button>
                {recommendedWeek === w.id && (
                  <span className="absolute -top-2 -right-1 bg-teal-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-xs text-center mb-4">
            <span className="bg-teal-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full mr-1">✓</span>
            Recommended based on your goal
          </p>

          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-full font-bold text-base bg-teal-400 hover:bg-teal-500 text-white transition-colors"
          >
            Continue →
          </button>
        </div>

      </div>
    </div>
  );
}
