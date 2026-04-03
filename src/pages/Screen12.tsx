import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "../components/BottomNav";
import { dashboard } from "../data/dashboard";
import { macros as macrosData } from "../data/macros";
import { hydration as hydrationData } from "../data/hydration";
import { workoutPlan } from "../data/workoutPlan";
import { mealPlan } from "../data/mealPlan";
const save = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));
const load = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export default function Screen12() {
  const [, navigate] = useLocation();
  const [water, setWater] = useState(() => load("dashboard_water", hydrationData.current));
  const [macros, setMacros] = useState(() => load("dashboard_calories", { protein: 0, carbs: 0, fat: 0 }));
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [tempWeight, setTempWeight] = useState("");

  useEffect(() => { save("dashboard_water", water); }, [water]);

  const addWater = (ml: number) => setWater((prev) => prev + ml);

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="w-full max-w-sm min-h-screen bg-[#f5f0eb] flex flex-col relative pb-24">

        {/* ── Header ── */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <img
              src="/assets/goku_main.png"
              alt="Goku"
              style={{ width: 76, height: "auto", objectFit: "contain", flexShrink: 0 }}
            />
            <div className="flex-1">
              <p className="text-xs text-gray-400 text-right">{dashboard.currentDate}</p>
              <p className="text-gray-900 text-base font-medium mt-1">
                {dashboard.greeting}<br />
                your glow is{" "}
                <span className="text-orange-500 font-bold">{dashboard.glowStatusLine}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Calories card ── */}
        <div className="mx-4 rounded-3xl p-6 mb-4" style={{ background: "linear-gradient(135deg, #c9900e, #e5a820)" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-sm font-medium">Calories left</span>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full border-4 border-white/30 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white">{dashboard.calories.left}</span>
              <span className="text-white/80 text-xs">left</span>
              <span className="text-white/60 text-xs">{dashboard.calories.consumed} / {dashboard.calories.goal} kcal</span>
            </div>
          </div>
        </div>

        {/* ── Today's Macros ── */}
        <div className="mx-4 bg-white rounded-2xl p-4 mb-4">
          <p className="text-gray-900 font-bold text-base mb-4">Today's Macros</p>
          {Object.entries(macrosData).map(([key, m]) => {
            const consumed = macros[key as keyof typeof macros];
            const pct = Math.min((consumed / m.target) * 100, 100);
            return (
              <div key={key} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{m.icon}</span>
                    <span className="text-gray-800 text-sm font-medium">{m.label}</span>
                  </div>
                  <span className="text-gray-800 text-sm">{consumed}{m.unit} / {m.target}{m.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Weight log + Hydration ── */}
        <div className="mx-4 grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setShowWeightInput(!showWeightInput)} className="bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[150px] text-left hover:shadow-md transition-shadow">
            {showWeightInput ? (
              <div className="w-full">
                <input
                  type="number"
                  placeholder="Enter weight"
                  value={tempWeight}
                  onChange={(e) => setTempWeight(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tempWeight) {
                      setShowWeightInput(false);
                      setTempWeight("");
                    }
                  }}
                  className="w-full bg-green-500 text-white text-xs py-1 rounded font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl mb-3">⚖️</div>
                <div>
                  <p className="text-gray-500 text-xs">Log Your</p>
                  <p className="font-bold text-gray-900">Weight</p>
                </div>
                <div className="self-end">
                  <div className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <span className="text-green-500 text-lg font-bold leading-none">+</span>
                  </div>
                </div>
              </>
            )}
          </button>

          <div className="bg-blue-500 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">Hydration</span>
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center">
                <span className="text-xs font-bold">{water}</span>
              </div>
              <span className="text-white/70 text-xs">/ {hydrationData.goal}{hydrationData.unit}</span>
            </div>
            <div className="flex gap-2 mb-2">
              {hydrationData.quickAddOptions.map((ml) => (
                <button key={ml} onClick={() => addWater(ml)} className="flex-1 bg-white text-blue-600 rounded-full py-1.5 text-xs font-semibold">
                  +{ml}{hydrationData.unit}
                </button>
              ))}
            </div>
            <button className="w-full bg-blue-400 rounded-full py-1.5 text-xs font-semibold">+Custom</button>
          </div>
        </div>

        {/* ── Workout + Meals ── */}
        <div className="mx-4 grid grid-cols-2 gap-3 mb-3">
          <button onClick={() => navigate("/plan")} className="bg-green-600 rounded-2xl p-4 text-white hover:bg-green-700 transition-colors">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl mb-3">💪</div>
            <p className="font-bold text-lg">{dashboard.todayWorkout.title}</p>
            <p className="text-green-200 text-xs">{dashboard.todayWorkout.subtitle}</p>
            <p className="text-green-200 text-xs">{dashboard.todayWorkout.duration}</p>
          </button>
          <button onClick={() => navigate("/plan")} className="rounded-2xl p-4 text-white hover:opacity-90 transition-opacity" style={{ background: "#b5760c" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3" style={{ background: "#c9900e" }}>🍽️</div>
            <p className="font-bold text-lg">{dashboard.todayMeals.title}</p>
            <p className="text-yellow-200 text-xs">{mealPlan.week[mealPlan.currentDayIndex]?.meals[0]?.type || dashboard.todayMeals.subtitle}</p>
            <p className="text-yellow-200 text-xs">{mealPlan.week[mealPlan.currentDayIndex]?.meals[0]?.kcal || dashboard.todayMeals.calories} kcal</p>
          </button>
        </div>

        {/* ── Go Ad-Free ── */}
        <div className="mx-4 mb-3 flex items-center justify-center">
          <button className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 bg-white">
            <span className="font-bold">✕</span> Go Ad-Free
          </button>
        </div>

        {/* ── OKX ad ── */}
        <div className="mx-4 mb-4">
          <div className="bg-gray-900 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">OKX</div>
              <div>
                <p className="font-semibold text-xs">Get 100 USDT in BTC rewards.</p>
                <p className="text-gray-400 text-xs">Sign up and trade today.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Coach Glow ── */}
        <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#f5e6d3" }}>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/assets/goku1.png"
              alt="Goku"
              style={{ width: 84, height: "auto", objectFit: "contain", flexShrink: 0 }}
            />
            <span className="font-bold text-gray-900 text-base">Coach Glow</span>
          </div>
          <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-full text-sm transition-colors">
            Ask Coach Glow
          </button>
        </div>

        <BottomNav active="home" />

      </div>
    </div>
  );
}
