import { useState } from "react";
import { useLocation } from "wouter";

const barriers = [
  { id: "motivation", icon: "🛏️", label: "Lack of motivation", bg: "bg-green-100" },
  { id: "stress", icon: "😟", label: "Stress", bg: "bg-purple-100" },
  { id: "start", icon: "❓", label: "Don't know where to start", bg: "bg-yellow-100" },
  { id: "cravings", icon: "🍴", label: "Diet cravings", bg: "bg-orange-100" },
  { id: "routine", icon: "🕐", label: "Inconsistent routine", bg: "bg-purple-100" },
  { id: "other", icon: "···", label: "Other", bg: "bg-blue-100" },
];

export default function Screen07() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [, navigate] = useLocation();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.size > 0) {
      localStorage.setItem("onboarding_fitness_obstacles", JSON.stringify(Array.from(selected)));
      navigate("/workout-time");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
          What stops you from achieving your fitness goals?
        </h1>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {barriers.map((b) => (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-all ${b.bg} ${selected.has(b.id) ? "ring-2 ring-gray-400" : ""}`}
            >
              <span className="text-2xl">{b.icon}</span>
              <span className="font-semibold text-gray-900 text-xs text-center leading-tight">{b.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-semibold text-base transition-colors ${selected.size > 0 ? "bg-green-400 hover:bg-green-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          Continue
        </button>
        <img
          src="/assets/goku_main.png"
          alt="Goku"
          style={{ position: "absolute", bottom: 8, right: 8, width: 100, height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
