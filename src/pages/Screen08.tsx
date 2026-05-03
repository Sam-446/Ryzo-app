import { useLocation } from "wouter";

const times = [
  { id: "morning", icon: "☀️", label: "Morning", bg: "bg-green-100" },
  { id: "afternoon", icon: "🕐", label: "Afternoon", bg: "bg-purple-100" },
  { id: "evening", icon: "🌙", label: "Evening", bg: "bg-yellow-100" },
  { id: "flexible", icon: "⇄", label: "Flexible", bg: "bg-blue-100" },
];

export default function Screen08() {
  const [, navigate] = useLocation();

const handleSelect = (id: string) => {
  localStorage.setItem("onboarding_preferred_workout_time", id);
  setTimeout(() => navigate("/barriers"), 180);
};

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 pt-8"
      style={{ background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)" }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          When do you prefer to work out?
        </h1>

        <div className="grid grid-cols-2 gap-3">
          {times.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all active:scale-95 ${t.bg}`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="font-bold text-gray-900 text-sm">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}