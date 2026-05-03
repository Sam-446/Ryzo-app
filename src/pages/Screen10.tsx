import { useLocation } from "wouter";

export default function Screen10() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Plan is Ready!</h1>
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#e9d5ff" strokeWidth="18" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#86efac" strokeWidth="18"
              strokeDasharray="502" strokeDashoffset="452" strokeLinecap="round" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#fed7aa" strokeWidth="18"
              strokeDasharray="502" strokeDashoffset="40" strokeLinecap="round"
              style={{ transform: "rotate(300deg)", transformOrigin: "center" }} />
          </svg>
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: "radial-gradient(circle at 40% 40%, #c4b5fd, #bfdbfe, #fde68a)" }}
          />
        </div>
        <p className="text-gray-600 font-medium">Your custom Vibe Plan is ready!</p>
        <div className="w-full">
          <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
            <div className="bg-green-500 h-2 rounded-full w-full" />
          </div>
          <p className="text-center text-green-500 font-semibold text-sm">100%</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 text-lg">Plan Complete!</span>
          <img
            src="/assets/goku5.png"
            alt="Goku"
            style={{ width: 150, height: "auto", objectFit: "contain" }}
          />
        </div>
        <button
          onClick={() => navigate("/congrats")}
          className="w-full py-4 rounded-full font-bold text-base bg-teal-200 hover:bg-teal-300 text-gray-900 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
