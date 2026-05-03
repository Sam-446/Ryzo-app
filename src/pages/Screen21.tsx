import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { supabase } from "../lib/supabase";

export default function Screen21() {
  const [loading, setLoading] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleNotify = async () => {
    if (loading || notified) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("feature_interests").insert({
  user_id: user.id,
  feature_name: "aura_streak_system",
});

if (error) {
  console.error("Insert error:", error.message);
} else {
  console.log("Insert success ✅");
  setNotified(true);
}

    if (!error) {
      setNotified(true);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-[#f5f0eb] flex items-center justify-center">
      <div className="w-full max-w-sm h-screen bg-[#f5f0eb] flex flex-col relative overflow-hidden">

        <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4">

          {/* ── Glow Up History ── */}
          <div className="bg-white rounded-2xl p-4 mb-4">

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/goku_main.png"
                  alt="Goku"
                  style={{ width: 52, height: "auto", objectFit: "contain" }}
                />
                <div>
                  <p className="font-bold text-gray-900 text-base">
                    Glow Up History
                  </p>
                  <p className="text-purple-500 text-sm">
                    Build your Aura streak
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>

            {/* Aura Ring */}
            <div className="flex flex-col items-center mt-6 mb-4">
              <div
                className="w-44 h-44 rounded-full flex items-center justify-center"
                style={{
                  border: "10px solid #e8d5f5",
                  background: "rgba(232,213,245,0.2)",
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-gray-900">
                    0
                  </span>
                  <span className="text-gray-500 text-sm mt-1">
                    Aura
                  </span>
                  <span className="text-purple-400 text-sm">
                    Starting
                  </span>
                </div>
              </div>
            </div>

            {/* Streak Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {Array(7).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-200"
                />
              ))}
            </div>

            {/* Golden Notify Button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={handleNotify}
                disabled={loading || notified}
                className={`
                  px-8 py-3 rounded-full text-sm font-semibold text-gray-800
                  transition-all duration-300
                  ${notified ? "bg-green-500 text-white" : "animate-pulse"}
                `}
                style={
                  notified
                    ? {}
                    : {
                        background:
                          "linear-gradient(90deg, #e5d87a, #c9b84a)",
                      }
                }
              >
                {notified
                  ? "✓ You'll be notified"
                  : loading
                  ? "Saving..."
                  : "Notify me when it arrives"}
              </button>
            </div>

          </div>
        </div>

        <BottomNav active="progress" />
      </div>
    </div>
  );
}
