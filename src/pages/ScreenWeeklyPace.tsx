import { useLocation } from "wouter";

const fatLossOptions = [
  { id: "0.25", icon: "🐢", label: "Easy", sub: "0.25 kg / week", bg: "bg-green-100" },
  { id: "0.5", icon: "✅", label: "Recommended", sub: "0.5 kg / week", bg: "bg-teal-100" },
  { id: "0.75", icon: "⚡", label: "Fast", sub: "0.75 kg / week", bg: "bg-yellow-100" },
  { id: "1.0", icon: "🔥", label: "Aggressive", sub: "1 kg / week", bg: "bg-orange-100" },
];

const muscleGainOptions = [
  { id: "0.25", icon: "💎", label: "Lean Bulk", sub: "0.25 kg / week", bg: "bg-purple-100" },
  { id: "0.5", icon: "✅", label: "Standard", sub: "0.5 kg / week", bg: "bg-teal-100" },
];

export default function ScreenWeeklyPace() {
  const [, navigate] = useLocation();
  const goal = localStorage.getItem("onboarding_primary_goal");

  if (goal === "maintain") {
    navigate("/workout-time");
    return null;
  }

  const isFatLoss = goal === "fat_loss";
  const options = isFatLoss ? fatLossOptions : muscleGainOptions;

const handleSelect = (id: string) => {
  localStorage.setItem("onboarding_weekly_pace", id);
  setTimeout(() => navigate("/workout-time"), 180);
};

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)" }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
          {isFatLoss ? "How fast do you want to lose?" : "How fast do you want to gain?"}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          {isFatLoss ? "Slower is easier to maintain" : "Slower means less fat gain"}
        </p>

        <div className="flex flex-col gap-3">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-95 ${o.bg}`}
            >
              <span className="text-2xl">{o.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900 text-base">{o.label}</p>
                <p className="text-gray-600 text-sm">{o.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
