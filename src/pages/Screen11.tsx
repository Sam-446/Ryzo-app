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
      // Read all onboarding data from localStorage
      const primaryGoal   = localStorage.getItem("onboarding_primary_goal") || "maintain";
      const height        = parseFloat(localStorage.getItem("onboarding_height") || "170");
      const heightUnit    = localStorage.getItem("onboarding_height_unit") || "cm";
      const currentWeight = parseFloat(localStorage.getItem("onboarding_current_weight") || "70");
      const goalWeight    = parseFloat(localStorage.getItem("onboarding_goal_weight") || "70");
      const weightUnit    = localStorage.getItem("onboarding_weight_unit") || "kg";
      const activityLevel = localStorage.getItem("onboarding_activity_level") || "moderately_active";
      const workoutTime   = localStorage.getItem("onboarding_preferred_workout_time") || "";
     const obstaclesRaw = localStorage.getItem("onboarding_fitness_obstacles") || "";
const obstacles = obstaclesRaw ? [obstaclesRaw] : [];
      const age           = parseInt(localStorage.getItem("onboarding_age") || "25");
      const gender        = localStorage.getItem("onboarding_gender") || "male";
      const weeklyPace    = parseFloat(localStorage.getItem("onboarding_weekly_pace") || "0.5");
      const timeline      = localStorage.getItem("onboarding_timeline") || "8w";

      // Step 1 — Save profile to Supabase
      setStatusMsg("Saving your profile...");
      const onboardingData = {
        primary_goal:             primaryGoal,
        height:                   height,
        height_unit:              heightUnit,
        current_weight:           currentWeight,
        goal_weight:              goalWeight,
        weight_unit:              weightUnit,
        activity_level:           activityLevel,
        diet_type:                "non_veg",
        preferred_workout_time:   workoutTime,
        fitness_obstacles:        obstacles,
        onboarding_complete:      true,
        age:                      age,
        gender:                   gender,
        weekly_pace:              weeklyPace,
      };

      const { error: dbError } = await supabase
        .from("profiles")
        .update(onboardingData)
        .eq("id", user.id);

      if (dbError) throw new Error(dbError.message);

      // Step 2 — Generate plan
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

      // Step 3 — Delete old plans
      setStatusMsg("Clearing old data...");
      await supabase.from("workout_plans").delete().eq("user_id", user.id);
      await supabase.from("meal_plans").delete().eq("user_id", user.id);
      await supabase.from("progress").delete().eq("user_id", user.id);
      await supabase.from("meal_logs").delete().eq("user_id", user.id);

      // Step 4 — Save new plan
      setStatusMsg("Saving your plan...");
      const { error: planError } = await saveUserPlan(user.id, generatedPlan);
      if (planError) throw new Error("Plan save failed: " + planError);

      // Step 5 — Clean localStorage
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

        {/* Status message */}
        {loading && (
          <div className="w-full bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            {statusMsg}
          </div>
        )}

        {/* Error */}
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

        {/* Success */}
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
          <p className="text-gray-400 text-sm">
            Your personalized journey starts now!
          </p>
        )}
      </div>
    </div>
  );
}
