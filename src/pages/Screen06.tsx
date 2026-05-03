import { useLocation } from "wouter";

const mealOptions = [
  { id: "3meals", icon: "🍽️", label: "3 meals/day", bg: "bg-green-100" },
  { id: "4-6meals", icon: "⊞", label: "4–6 smaller meals", bg: "bg-purple-100" },
  { id: "fasting", icon: "🕐", label: "Intermittent fasting", bg: "bg-yellow-100" },
  { id: "other", icon: "···", label: "Other", bg: "bg-blue-100" },
];

export default function Screen06() {
  const [, navigate] = useLocation();

  const handleSelect = (id: string) => {
    localStorage.setItem("onboarding_meal_routine", id);
    setTimeout(() => navigate("/workout-time"), 180);
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-8"
      style={{ background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)" }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Your meal routine</h1>
        <p className="text-gray-400 text-sm mb-6">How often do you prefer to eat?</p>

        <div className="flex flex-col gap-3">
          {mealOptions.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl font-bold text-gray-900 text-base transition-all active:scale-95 ${m.bg}`}
            >
              <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-lg font-bold">
                {m.icon}
              </span>
              {m.label}
            </button>
          ))}
        </div>

        <img
          src="/assets/goku1.png"
          alt="Goku"
          style={{ position: "absolute", bottom: 8, right: 8, width: 108, height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
