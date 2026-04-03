import { useLocation } from "wouter";

type Tab = "home" | "plan" | "progress" | "profile";

export default function BottomNav({ active }: { active: Tab }) {
  const [, navigate] = useLocation();

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-4 py-3 z-10">
        <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "home" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className={`text-xs ${active === "home" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Home</span>
        </button>
        <button onClick={() => navigate("/plan")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "plan" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className={`text-xs ${active === "plan" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Plan</span>
        </button>
        <button onClick={() => navigate("/progress")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "progress" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span className={`text-xs ${active === "progress" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Progress</span>
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1">
          <svg className={`w-5 h-5 ${active === "profile" ? "text-orange-500" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span className={`text-xs ${active === "profile" ? "text-orange-500 font-medium" : "text-gray-400"}`}>Profile</span>
        </button>
      </div>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <button className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
      </div>
    </>
  );
}
