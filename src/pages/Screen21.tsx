import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { progress } from "../data/progress";
import { aura } from "../data/aura";
import { userProfile } from "../data/userProfile";

const save = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));
const load = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export default function Screen21() {
  const [showToast, setShowToast] = useState(false);
  const [streakCount, setStreakCount] = useState(() => load("progress_streakCount", progress.streak.current));
  const [auraPoints, setAuraPoints] = useState(() => load("progress_auraPoints", progress.auraPoints));

  useEffect(() => { save("progress_streakCount", streakCount); }, [streakCount]);
  useEffect(() => { save("progress_auraPoints", auraPoints); }, [auraPoints]);

  const handleShareStreak = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="w-full max-w-sm h-screen bg-[#f5f0eb] flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4">

          {/* ── Glow Up History header card ── */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/goku_main.png" alt="Goku" style={{ width: 52, height: "auto", objectFit: "contain" }} />
                <div>
                  <p className="font-bold text-gray-900 text-base">Glow Up History</p>
                  <p className="text-purple-500 text-sm">Keep shining, {userProfile.name}!</p>
                </div>
              </div>
              <button className="text-gray-400 mt-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            </div>

            {/* Aura ring */}
            <div className="flex flex-col items-center mt-6 mb-4">
              <div className="w-44 h-44 rounded-full flex items-center justify-center"
                style={{ border: "10px solid #e8d5f5", background: "rgba(232,213,245,0.2)" }}>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-gray-900">{auraPoints}</span>
                  <span className="text-gray-500 text-sm mt-1">Aura</span>
                  <span className="text-purple-400 text-sm">{progress.levelName}</span>
                </div>
              </div>
            </div>

            {/* Streak dots */}
            <div className="flex justify-center gap-2 mb-4">
              {Array(7).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full transition-colors ${
                    i < streakCount ? "bg-purple-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Start streak button */}
            <div className="flex justify-center mb-4">
              <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-700"
                style={{ background: "linear-gradient(90deg, #e5d87a, #c9b84a)" }}>
                Start your streak today!
              </button>
            </div>

            {/* Current / Best / Weeks */}
            <div className="flex items-center rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex-1 py-3 flex flex-col items-center">
                <span className="font-bold text-gray-900 text-lg">{streakCount}</span>
                <span className="text-gray-400 text-xs">Current</span>
              </div>
              <div className="w-px bg-gray-200 self-stretch" />
              <div className="flex-1 py-3 flex flex-col items-center">
                <span className="font-bold text-gray-900 text-lg">{progress.streak.best}</span>
                <span className="text-gray-400 text-xs">Best</span>
              </div>
              <div className="w-px bg-gray-200 self-stretch" />
              <div className="flex-1 py-3 flex flex-col items-center">
                <span className="font-bold text-gray-900 text-lg">{progress.streak.weeks}</span>
                <span className="text-gray-400 text-xs">Weeks</span>
              </div>
            </div>
          </div>

          {/* ── Weekly Report ── */}
          <button className="w-full bg-green-50 rounded-2xl p-4 mb-4 flex items-center justify-between hover:bg-green-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="12" width="4" height="8" rx="1" fill="#e74c3c"/>
                  <rect x="10" y="6" width="4" height="14" rx="1" fill="#2ecc71"/>
                  <rect x="17" y="9" width="4" height="11" rx="1" fill="#3498db"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">{progress.weeklyReport.title}</p>
                <p className="text-green-600 text-xs">{progress.weeklyReport.subtitle}</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* ── Achievements ── */}
          <div className="mb-4">
            <p className="font-bold text-gray-900 text-base mb-2">Achievements</p>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-gray-500 text-sm text-center">{progress.achievementsPlaceholder}</p>
            </div>
          </div>

          {/* ── Go Ad-Free ── */}
          <div className="flex justify-center mb-4">
            <button className="flex items-center gap-1 border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-600 bg-white">
              <span className="font-bold">✕</span> Go Ad-Free
            </button>
          </div>

          {/* ── AI Body Fat Analyzer ── */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#fce8f0" }}>
            <p className="font-bold text-gray-900 text-sm mb-1">🔬 {progress.bodyFatAnalyzer.title}</p>
            <p className="text-gray-500 text-xs mb-3">{progress.bodyFatAnalyzer.subtitle}</p>
            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-full text-sm transition-colors">
              🔒 {progress.bodyFatAnalyzer.ctaText}
            </button>
          </div>

          {/* ── Progress Comparison ── */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#fce8f0" }}>
            <p className="font-bold text-gray-900 text-sm mb-1">{progress.progressComparison.title}</p>
            <p className="text-gray-500 text-xs mb-3">{progress.progressComparison.subtitle}</p>
            <button className="w-full font-bold py-3 rounded-full text-sm text-gray-800"
              style={{ background: "#d8b4fe" }}>
              {progress.progressComparison.ctaText}
            </button>
          </div>

          {/* ── Progress & Stats ── */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#cffafe" }}>
            <p className="font-bold text-gray-900 text-base mb-3">Progress &amp; Stats</p>
            <p className="text-gray-600 text-sm mb-1">Total Aura:</p>
            <p className="text-pink-500 font-bold text-2xl mb-1">{auraPoints}</p>
            <p className="text-gray-500 text-sm mb-2">{progress.levelName}</p>
            <p className="text-gray-600 text-sm mb-1">Best streak: {progress.streak.best} days</p>
            <p className="text-green-600 font-semibold text-sm mb-4">This week: {progress.currentWeekCompletion}% complete</p>
            <button onClick={handleShareStreak} className="w-full font-bold py-3 rounded-full text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: "#a78bfa" }}>
              🏆 Share your Glow Streak
            </button>
          </div>

        </div>

        {showToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full text-sm font-semibold shadow-lg animate-pulse">
            ✓ Streak shared!
          </div>
        )}

        <BottomNav active="progress" />
      </div>
    </div>
  );
}
