import { useState } from "react";
import { useLocation } from "wouter";

const mealOptions = [
  { id: "3meals", icon: "✕", label: "3 meals/day", bg: "bg-green-100" },
  { id: "4-6meals", icon: "⊞", label: "4–6 smaller meals", bg: "bg-purple-100" },
  { id: "fasting", icon: "🕐", label: "Intermittent fasting", bg: "bg-yellow-100" },
  { id: "other", icon: "···", label: "Other", bg: "bg-blue-100" },
];

export default function Screen06() {
  const [selected, setSelected] = useState<string | null>(null);
  const [allergies, setAllergies] = useState("");
  const [, navigate] = useLocation();

  const handleContinue = () => {
    if (selected) {
      localStorage.setItem("onboarding_meal_routine", selected);
      localStorage.setItem("onboarding_allergies", allergies);
      navigate("/barriers");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-yellow-50 flex items-start justify-center p-4 pt-8">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Your meal routine</h1>
        <p className="text-gray-400 text-sm mb-6">How often do you prefer to eat?</p>
        <div className="flex flex-col gap-3 mb-6">
          {mealOptions.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl font-bold text-gray-900 text-base transition-all ${m.bg} ${selected === m.id ? "ring-2 ring-green-400" : ""}`}
            >
              <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-lg font-bold">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Any allergies?</h2>
          <textarea
            placeholder="E.g., peanuts, gluten, dairy"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-600 placeholder:text-gray-300 resize-none focus:outline-none focus:border-green-300"
          />
          <p className="text-xs text-gray-400 mt-1">(Optional)</p>
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
