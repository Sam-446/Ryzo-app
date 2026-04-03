import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { generateUserPlan } from "../lib/planGenerator";
import { saveUserPlan } from "../lib/planSaver";
export default function Screen11() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Go to Dashboard");

  const handleDashboard = async () => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError("");

    const onboardingData = {
      primary_goal: localStorage.getItem("onboarding_primary_goal"),
      height: parseFloat(localStorage.getItem("onboarding_height") || "0"),
      height_unit: localStorage.getItem("onboarding_height_unit") || "cm",
      current_weight: parseFloat(localStorage.getItem("onboarding_current_weight") || "0"),
      goal_weight: parseFloat(localStorage.getItem("onboarding_goal_weight") || "0"),
      weight_unit: localStorage.getItem("onboarding_weight_unit") || "kg",
      activity_level: localStorage.getItem("onboarding_activity_level"),
      diet_type: localStorage.getItem("onboarding_meal_routine"),
      meal_routine: localStorage.getItem("onboarding_meal_routine"),
      preferred_workout_time: localStorage.getItem("onboarding_preferred_workout_time"),
      fitness_obstacles: localStorage.getItem("onboarding_fitness_obstacles")
        ? JSON.parse(localStorage.getItem("onboarding_fitness_obstacles") || "[]")
        : [],
      motivation_level: parseInt(localStorage.getItem("onboarding_motivation_level") || "0"),
      onboarding_complete: true,
    };

    // Step 1: Save profile to Supabase
    setStatusMsg("Saving your profile…");
    const { error: dbError } = await supabase
      .from("profiles")
      .update(onboardingData)
      .eq("id", user.id);

    if (dbError) {
      setLoading(false);
      setStatusMsg("Go to Dashboard");
      setError(dbError.message);
      return;
    }

    // Step 2: Generate personalized plan
    setStatusMsg("Generating your plan…");
    const profile = {
      ...onboardingData,
      age: 25,
      gender: "male",
    };

    let generatedPlan;
    try {
      generatedPlan = generateUserPlan(profile);
    } catch (genErr) {
      setLoading(false);
      setStatusMsg("Go to Dashboard");
      setError("Plan generation failed. " + (genErr instanceof Error ? genErr.message : ""));
      return;
    }

    // Step 3: Save plan to Supabase
    setStatusMsg("Saving your workout & meal plan…");
    const { error: planError } = await saveUserPlan(user.id, generatedPlan);

    if (planError) {
      setLoading(false);
      setStatusMsg("Go to Dashboard");
      setError("Plan save failed: " + planError);
      return;
    }

    // Step 4: Clean up localStorage and navigate
    const keysToRemove = [
      "onboarding_primary_goal",
      "onboarding_height",
      "onboarding_height_unit",
      "onboarding_current_weight",
      "onboarding_goal_weight",
      "onboarding_weight_unit",
      "onboarding_activity_level",
      "onboarding_meal_routine",
      "onboarding_preferred_workout_time",
      "onboarding_fitness_obstacles",
      "onboarding_motivation_level",
      "onboarding_allergies",
      "onboarding_timeline",
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
          Congrats Connect.nexmedia,<br />
          your Vibe Plan is ready!<br />
          Let's get glowing!
        </h1>
        {/* Large Goku centered in card */}
        <img
          src="/assets/goku6.png"
          alt="Goku"
          style={{ width: 240, height: "auto", objectFit: "contain" }}
        />
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}
        <button
          onClick={handleDashboard}
          disabled={loading}
          className={`w-full py-4 rounded-full font-bold text-base transition-colors ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-200 to-green-200 hover:from-teal-300 hover:to-green-300 text-gray-900"
          }`}
        >
          {loading ? statusMsg : "Go to Dashboard"}
        </button>
        <p className="text-gray-400 text-sm">
          Your personalized journey starts now—track your progress, unlock aura, and celebrate every win!
        </p>
      </div>
    </div>
  );
}
