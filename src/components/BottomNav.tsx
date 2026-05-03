import { useState } from "react";
import { useLocation } from "wouter";

type Tab = "home" | "plan" | "progress" | "profile";

export default function BottomNav({ active }: { active: Tab }) {
  const [, navigate] = useLocation();
  const [showSheet, setShowSheet] = useState(false);

  return (
    <>
      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex items-center justify-around px-4 py-3 z-50">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "home" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className={`text-xs ${active === "home" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Home</span>
        </button>

        <button onClick={() => navigate("/plan")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "plan" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className={`text-xs ${active === "plan" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Plan</span>
        </button>

        {/* Empty space for camera */}
        <div className="w-12" />

        <button onClick={() => navigate("/progress")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "progress" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span className={`text-xs ${active === "progress" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Progress</span>
        </button>

        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "profile" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span className={`text-xs ${active === "profile" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Profile</span>
        </button>
      </div>

      {/* Camera Button */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowSheet(true)}
          className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
      </div>

      {/* Bottom Sheet */}
      {showSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowSheet(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white rounded-t-3xl z-50 p-6 pb-10">

            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <p className="text-gray-900 font-bold text-base mb-1">
              AI Food Tools
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Scan your food and track calories instantly
            </p>

            <div className="grid grid-cols-2 gap-4">

              {/* Scan Food */}
              <button
                onClick={() => {
                  setShowSheet(false);
                  window.location.href = "/scan-food";
                }}
                className="flex flex-col items-center gap-3 bg-green-50 rounded-2xl p-5 hover:bg-green-100 transition-colors"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M3 2v7c0 1.1.9 2 2 2h2v11a1 1 0 0 0 2 0V11h2a2 2 0 0 0 2-2V2"/>
  <line x1="7" y1="2" x2="7" y2="7"/>
  <line x1="5" y1="2" x2="5" y2="7"/>
  <line x1="9" y1="2" x2="9" y2="7"/>
  <path d="M21 2c0 0-2 2-2 6s2 6 2 6v8a1 1 0 0 1-2 0v-8s-2-2-2-6 2-6 2-6"/>
</svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm">Scan Food</p>
                  <p className="text-gray-400 text-xs mt-0.5">AI Calorie Tracker</p>
                </div>
              </button>

              {/* Barcode */}
              <button
                onClick={() => {
                  setShowSheet(false);
                  window.location.href = "/scan-barcode";
                }}
                className="flex flex-col items-center gap-3 bg-blue-50 rounded-2xl p-5 hover:bg-blue-100 transition-colors"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9V5a2 2 0 0 1 2-2h4M3 15v4a2 2 0 0 0 2 2h4M21 9V5a2 2 0 0 0-2-2h-4M21 15v4a2 2 0 0 1-2 2h-4"/>
                    <line x1="7" y1="12" x2="7" y2="12"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="17" y1="12" x2="17" y2="12"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm">Barcode</p>
                  <p className="text-gray-400 text-xs mt-0.5">Scan Packaging</p>
                </div>
              </button>

            </div>

            <p className="text-center text-gray-300 text-xs mt-6">
              Tap anywhere to close
            </p>
          </div>
        </>
      )}
    </>
  );
}
