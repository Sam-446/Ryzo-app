import { useState } from "react";
import { useLocation } from "wouter";

const times = [
  { id: "morning", icon: "☀️", label: "Morning", bg: "bg-green-100" },
  { id: "afternoon", icon: "🕐", label: "Afternoon", bg: "bg-purple-100" },
  { id: "evening", icon: "🌙", label: "Evening", bg: "bg-yellow-100" },
  { id: "flexible", icon: "⇄", label: "Flexible", bg: "bg-blue-100" },
];

export default function Screen08() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const handleContinue = () => {
    if (selected) {
      localStorage.setItem("onboarding_preferred_workout_time", selected);
      navigate("/motivation");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
          When do you prefer to work out?
        </h1>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {times.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all ${t.bg} ${selected === t.id ? "ring-2 ring-gray-400" : ""}`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="font-bold text-gray-900 text-sm">{t.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-semibold text-base transition-colors ${selected ? "bg-green-400 hover:bg-green-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          Continue
        </button>
        {!selected && (
          <p className="text-center text-sm text-gray-400 mt-2">Please select one option</p>
        )}
        {/* Goku5 is a horizontal push-up pose — use wider dimensions */}
        <img
          src="/assets/goku5.png"
          alt="Goku"
          style={{ position: "absolute", bottom: 8, right: 0, width: 96, height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
