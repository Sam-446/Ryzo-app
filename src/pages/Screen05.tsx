import { useState } from "react";
import { useLocation } from "wouter";

const activities = [
  { id: "sedentary", icon: "🪑", title: "Sedentary", subtitle: "Little or no exercise", iconBg: "bg-green-100" },
  { id: "lightly", icon: "🚶", title: "Lightly active", subtitle: "Light exercise 1–3 days/week", iconBg: "bg-purple-100" },
  { id: "moderately", icon: "🤸", title: "Moderately active", subtitle: "Moderate exercise 3–5 days/week", iconBg: "bg-teal-100" },
  { id: "super", icon: "🏋️", title: "Super active", subtitle: "Very hard exercise or physical job", iconBg: "bg-pink-100" },
];

export default function Screen05() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const handleContinue = () => {
    if (selected) {
      localStorage.setItem("onboarding_activity_level", selected);
      navigate("/meal-routine");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          What is your current activity level?
        </h1>
        <div className="flex flex-col gap-3 mb-8">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${selected === a.id ? "border-green-400 bg-green-50" : "border-transparent bg-gray-50"}`}
            >
              <span className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${a.iconBg} flex-shrink-0`}>{a.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900 text-sm">{a.title}</p>
                <p className="text-gray-500 text-xs">{a.subtitle}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selected === a.id ? "border-green-400 bg-green-400" : "border-gray-300"}`} />
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
          src="/assets/goku4.png"
          alt="Goku"
          style={{ position: "absolute", bottom: 8, right: 8, width: 108, height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
