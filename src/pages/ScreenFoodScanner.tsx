import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

export default function ScreenFoodScanner() {
  const [, navigate] = useLocation();
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInterest = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("feature_interests")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("feature_name", "ai_food_scanner");

        if (data && data.length > 0) setNotified(true);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    checkInterest();
  }, []);

  const handleNotify = async () => {
    if (loading || notified) return;

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      await supabase
        .from("feature_interests")
        .upsert(
          { user_id: session.user.id, feature_name: "ai_food_scanner" },
          { onConflict: "user_id,feature_name" }
        );

      setNotified(true);
    } catch (err) {
      console.error(err);
    }

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
            Nutrition Analysis
          </p>
        </div>

        <div className="px-4">

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-4 shadow-sm">

            {/* Image */}
            <img
              src="/assets/desi_breakfast.jpg"
              alt="2 eggs, 2 roti, banana shake"
              className="w-full h-40 object-cover rounded-2xl mb-4"
            />

            <p className="text-sm font-semibold text-gray-800 mb-3">
              2 eggs, 2 roti, banana shake
            </p>

            {/* ONE ROW Nutrition */}
            <div className="flex justify-between items-center mb-4">
              {[
                { value: "640", label: "Cal", color: "bg-orange-400" },
                { value: "32g", label: "Protein", color: "bg-green-500" },
                { value: "78g", label: "Carbs", color: "bg-blue-500" },
                { value: "22g", label: "Fat", color: "bg-yellow-500" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {item.value}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Detected Items */}
            <div className="bg-gray-50 rounded-2xl p-3 mb-4">
              <p className="font-bold text-gray-900 text-sm mb-3">
                Detected Food Items
              </p>

              <div className="space-y-2 text-xs text-gray-800">
                <div className="flex justify-between">
                  <span>🍳 2 Half-Fried Eggs</span>
                  <span className="text-green-600 font-semibold">
                    High confidence
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🫓 2 Roti</span>
                  <span className="text-green-600 font-semibold">
                    High confidence
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🥤 Banana Shake (1 glass)</span>
                  <span className="text-green-600 font-semibold">
                    High confidence
                  </span>
                </div>
              </div>
            </div>

            {/* Lock Section */}
            <div className="bg-[#f5e6d3] rounded-2xl p-4 text-center">
              <p className="font-bold text-gray-900 text-sm mb-1">
                🔒 AI Scanner launching soon
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Scan meals instantly — roti, daal, karahi.
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

              {notified && (
                <p className="text-gray-400 text-[10px] mt-2">
                  You're on the list. We'll notify you first.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
