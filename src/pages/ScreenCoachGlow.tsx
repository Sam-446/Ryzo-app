import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

export default function ScreenCoachGlow() {
  const [location, navigate] = useLocation();
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiTyping, setAiTyping] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  // Get question from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const question = params.get("question");
    if (question) setUserQuestion(question);
  }, [location]);

  // Check notify status
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
        .eq("feature_name", "coach_glow_ai");

      if (data && data.length > 0) setNotified(true);
      setLoading(false);
    };

    checkInterest();
  }, []);

  // Fake AI typing
  useEffect(() => {
    if (!userQuestion) return;

    setAiTyping(true);
    setShowAnswer(false);

    const timer = setTimeout(() => {
      setAiTyping(false);
      setShowAnswer(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [userQuestion]);

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
        { user_id: session.user.id, feature_name: "coach_glow_ai" },
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
            Coach Ryzo
          </p>
        </div>

        <div className="px-4">

          <div className="bg-white rounded-3xl p-4 shadow-sm space-y-4">

            {/* User Message */}
            {userQuestion && (
              <div className="bg-black text-white rounded-2xl p-3 text-sm self-end">
                {userQuestion}
              </div>
            )}

            {/* AI Reply */}
            {userQuestion && (
              <div className="relative bg-gray-100 rounded-2xl p-3 text-sm text-gray-800 overflow-hidden">
                {aiTyping && "Typing..."}
                {!aiTyping && showAnswer && (
                  <>
                    Based on your profile and current plan, you may not be eating enough calories consistently. Your body needs a slight surplus maintained daily to see muscle growth results...
                  </>
                )}

                {/* Blur bottom */}
                {!aiTyping && showAnswer && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-100 to-transparent" />
                )}
              </div>
            )}

            {/* Lock Section */}
            {!aiTyping && showAnswer && (
              <div className="bg-[#f5e6d3] rounded-2xl p-4 text-center">
                <p className="font-bold text-gray-900 text-sm mb-1">
                  🔒 AI Guidance — Coming Soon
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  Personalized answers based on your workouts & meals.
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
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
