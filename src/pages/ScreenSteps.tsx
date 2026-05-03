import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

export default function ScreenSteps() {
  const [, navigate] = useLocation();
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(true);

  const steps = 8432;
  const goal = 10000;
  const percentage = Math.min((steps / goal) * 100, 100);

  useEffect(() => {
    const checkInterest = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("feature_interests")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("feature_name", "steps_tracking");

      if (data && data.length > 0) setNotified(true);

      setLoading(false);
    };

    checkInterest();
  }, []);

  const handleNotify = async () => {
    if (loading || notified) return;

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    await supabase
      .from("feature_interests")
      .upsert(
        { user_id: session.user.id, feature_name: "steps_tracking" },
        { onConflict: "user_id,feature_name" }
      );

    setNotified(true);
    setLoading(false);
  };

  const buttonStyle = notified
    ? {}
    : loading
    ? { background: "#e5e7eb" }
    : { background: "linear-gradient(90deg, #e5d87a, #c9b84a)" };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col pb-6">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            ←
          </button>
          <p className="font-bold text-gray-900 text-base">
            Daily Steps
          </p>
        </div>

        <div className="px-4">

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">

            {/* Big Number */}
            <div className="text-center mb-4">
              <p className="text-4xl font-extrabold text-gray-900">
                {steps.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                / {goal.toLocaleString()} steps
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Aura Points */}
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-purple-600">
                +120 Aura Points earned
              </p>
            </div>

            {/* Connected Apps */}
            <div className="flex justify-between text-xs text-gray-500 mb-5">
              <span>🍎 Apple Health</span>
              <span>🤖 Google Fit</span>
              <span>📱 Samsung</span>
              <span>⌚ Fitbit</span>
            </div>

            {/* Lock Section */}
            <div className="bg-[#f5e6d3] rounded-2xl p-4 text-center">
              <p className="font-bold text-gray-900 text-sm mb-1">
                🔒 Auto-sync steps — coming soon
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Connect your apps & earn Aura automatically.
              </p>

              <button
                onClick={handleNotify}
                disabled={loading || notified}
                className={`w-full py-2.5 rounded-full text-xs font-bold transition-all ${
                  notified ? "bg-green-500 text-white" : "text-gray-800"
                }`}
                style={buttonStyle}
              >
                {notified
                  ? "✓ You'll be notified"
                  : loading
                  ? "Checking..."
                  : "Notify Me"}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
