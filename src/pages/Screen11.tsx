import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { generateUserPlan } from "../lib/planGenerator";
import { saveUserPlan } from "../lib/planSaver";

export default function Screen11() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Saving your profile...");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) return;
    handleGeneratePlan();
  }, [user]);

  const handleGeneratePlan = async () => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const primaryGoal   = localStorage.getItem("onboarding_primary_goal") || "maintain";
      const height        = parseFloat(localStorage.getItem("onboarding_height") || "170");
      const heightUnit    = localStorage.getItem("onboarding_height_unit") || "cm";
      const currentWeight = parseFloat(localStorage.getItem("onboarding_current_weight") || "70");
      const goalWeight    = parseFloat(localStorage.getItem("onboarding_goal_weight") || "70");
      const weightUnit    = localStorage.getItem("onboarding_weight_unit") || "kg";
      const activityLevel = localStorage.getItem("onboarding_activity_level") || "moderately_active";
      const workoutTime   = localStorage.getItem("onboarding_preferred_workout_time") || "";
      const obstaclesRaw  = localStorage.getItem("onboarding_fitness_obstacles") || "";
      const obstacles     = obstaclesRaw ? [obstaclesRaw] : [];
      const age           = parseInt(localStorage.getItem("onboarding_age") || "25");
      const gender        = localStorage.getItem("onboarding_gender") || "male";
      const weeklyPace    = parseFloat(localStorage.getItem("onboarding_weekly_pace") || "0.5");
      const timeline      = localStorage.getItem("onboarding_timeline") || "8w";

      setStatusMsg("Saving your profile...");
      const onboardingData = {
        primary_goal:           primaryGoal,
        height:                 height,
        height_unit:            heightUnit,
        current_weight:         currentWeight,
        goal_weight:            goalWeight,
        weight_unit:            weightUnit,
        activity_level:         activityLevel,
        diet_type:              "non_veg",
        preferred_workout_time: workoutTime,
        fitness_obstacles:      obstacles,
        onboarding_complete:    true,
        age:                    age,
        gender:                 gender,
        weekly_pace:            weeklyPace,
      };

      const { error: dbError } = await supabase
        .from("profiles")
        .update(onboardingData)
        .eq("id", user.id);

      if (dbError) throw new Error(dbError.message);

      setStatusMsg("Generating your personalized plan...");
      const profileForPlan = {
        primary_goal:   primaryGoal,
        height:         height,
        height_unit:    heightUnit,
        current_weight: currentWeight,
        weight_unit:    weightUnit,
        activity_level: activityLevel,
        diet_type:      "non_veg",
        age:            age,
        gender:         gender,
        weekly_pace:    weeklyPace,
      };

      const generatedPlan = generateUserPlan(profileForPlan);

      setStatusMsg("Clearing old data...");
      await supabase.from("workout_plans").delete().eq("user_id", user.id);
      await supabase.from("meal_plans").delete().eq("user_id", user.id);
      await supabase.from("progress").delete().eq("user_id", user.id);
      await supabase.from("meal_logs").delete().eq("user_id", user.id);

      setStatusMsg("Saving your plan...");
      const { error: planError } = await saveUserPlan(user.id, generatedPlan);
      if (planError) throw new Error("Plan save failed: " + planError);

      [
        "onboarding_primary_goal",
        "onboarding_height",
        "onboarding_height_unit",
        "onboarding_current_weight",
        "onboarding_goal_weight",
        "onboarding_weight_unit",
        "onboarding_activity_level",
        "onboarding_diet_type",
        "onboarding_meal_routine",
        "onboarding_preferred_workout_time",
        "onboarding_fitness_obstacles",
        "onboarding_motivation_level",
        "onboarding_weekly_pace",
        "onboarding_timeline",
        "onboarding_gender",
        "onboarding_age",
        "onboarding_allergies",
        "onboarding_budget_pkr",
      ].forEach((k) => localStorage.removeItem(k));

      setLoading(false);
      setDone(true);
      setStatusMsg("Your plan is ready!");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)",
      }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6 text-center">

        <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
          {done ? "Your Aura Plan is Ready! 🔥" : "One Second..."}
        </h1>

        <img
          src="/assets/goku6.png"
          alt="Goku"
          style={{ width: 200, height: "auto", objectFit: "contain" }}
        />

        {loading && (
          <div className="w-full bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            {statusMsg}
          </div>
        )}

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">
            {error}
            <button
              onClick={handleGeneratePlan}
              className="block mt-2 text-red-700 font-bold underline text-xs"
            >
              Try again
            </button>
          </div>
        )}

        {done && (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-2xl">
            ✅ Plan generated and saved successfully!
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          disabled={loading}
          className={`w-full py-4 rounded-full font-bold text-base transition-colors ${
            loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-teal-400 hover:bg-teal-500 text-white"
          }`}
        >
          {loading ? "Building your plan..." : "Go to Dashboard 🚀"}
        </button>

        {done && (
          <>
            <p className="text-gray-400 text-sm">
              Your personalized journey starts now!
            </p>
            <a
              href="https://chat.whatsapp.com/Bx7Ksc7ITprFVS2UVoZRCG"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-base text-white"
              style={{ background: "#25D366" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
                <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45z"/>
              </svg>
              Join 500+ Founding members — Free
            </a>
          </>
        )}

      </div>
    </div>
  );
}
