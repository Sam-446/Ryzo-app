import { useState } from "react";
import { useLocation } from "wouter";

export default function Screen13() {
  const [water, setWater] = useState(0);
  const [, navigate] = useLocation();

  const addWater = (ml: number) => setWater((prev) => prev + ml);

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="w-full max-w-sm min-h-screen bg-[#f5f0eb] flex flex-col pb-24 relative">
        <div className="mx-4 mt-4 grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[150px]">
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
          </div>

          <div className="bg-blue-500 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">Hydration</span>
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center">
                <span className="text-xs font-bold">{water}</span>
              </div>
              <span className="text-white/70 text-xs">/ 3000ml</span>
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={() => addWater(250)} className="flex-1 bg-white text-blue-600 rounded-full py-1.5 text-xs font-semibold">+250ml</button>
              <button onClick={() => addWater(500)} className="flex-1 bg-white text-blue-600 rounded-full py-1.5 text-xs font-semibold">+500ml</button>
            </div>
            <button className="w-full bg-blue-400 rounded-full py-1.5 text-xs font-semibold">+Custom</button>
          </div>
        </div>

        <div className="mx-4 grid grid-cols-2 gap-3 mb-3">
          <div className="bg-green-600 rounded-2xl p-4 text-white">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl mb-3">💪</div>
            <p className="font-bold text-lg">Workout</p>
            <p className="text-green-200 text-xs">Workout Day</p>
            <p className="text-green-200 text-xs">30 min</p>
          </div>
          <div className="rounded-2xl p-4 text-white" style={{ background: "#b5760c" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3" style={{ background: "#c9900e" }}>🍽️</div>
            <p className="font-bold text-lg">Meals</p>
            <p className="text-yellow-200 text-xs">Breakfast</p>
            <p className="text-yellow-200 text-xs">623 kcal</p>
          </div>
        </div>

        <div className="mx-4 mb-3 flex items-center justify-center">
          <button className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600 bg-white">
            <span className="font-bold">✕</span> Go Ad-Free
          </button>
        </div>

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

        <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#f5e6d3" }}>
          <div className="flex items-center gap-3 mb-3">
            {/* goku1 (thumbs up) in Coach Glow section */}
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

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-4 py-3">
          <button className="flex flex-col items-center gap-1" onClick={() => navigate("/dashboard")}>
            <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span className="text-orange-500 text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="text-gray-400 text-xs">Plan</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span className="text-gray-400 text-xs">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-gray-400 text-xs">Profile</span>
          </button>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <button className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
