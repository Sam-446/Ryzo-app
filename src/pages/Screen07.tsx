import { useLocation } from "wouter";

const barriers = [
  { id: "motivation", icon: "🛏️", label: "Lack of motivation", bg: "bg-green-100" },
  { id: "stress", icon: "😟", label: "Stress", bg: "bg-purple-100" },
  { id: "start", icon: "❓", label: "Don't know where to start", bg: "bg-yellow-100" },
  { id: "cravings", icon: "🍴", label: "Diet cravings", bg: "bg-orange-100" },
  { id: "routine", icon: "🕐", label: "Inconsistent routine", bg: "bg-pink-100" },
  { id: "other", icon: "···", label: "Other", bg: "bg-blue-100" },
];

export default function Screen07() {
  const [, navigate] = useLocation();

const handleSelect = (id: string) => {
  localStorage.setItem("onboarding_fitness_obstacles", id);
  setTimeout(() => navigate("/plan-ready"), 250);
};

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 pt-8"
      style={{ background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #eaf7fb 100%)" }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          What's your biggest challenge?
        </h1>

        <div className="grid grid-cols-2 gap-3">
          {barriers.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSelect(b.id)}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-all active:scale-95 ${b.bg}`}
            >
              <span className="text-2xl">{b.icon}</span>
              <span className="font-semibold text-gray-900 text-xs text-center leading-tight">{b.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
