import { calculateTDEE, normalizeGoal } from "./tdeeCalculator";
import { workoutTemplates, type WorkoutDayTemplate } from "../data/templates/workoutTemplates";
import { mealTemplates, type MealPlanTemplate, type DayMeals } from "../data/templates/mealTemplates";

export interface GeneratedWorkoutPlan {
  days: WorkoutDayTemplate[];
}

export interface GeneratedMealPlan {
  days: DayMeals[];
}

export type NutritionTargets = ReturnType<typeof calculateTDEE>;

// Keep Profile flexible (because your DB/localStorage fields vary)
export type Profile = Record<string, any>;

export interface GeneratedPlan {
  workoutPlan: GeneratedWorkoutPlan;
  mealPlan: GeneratedMealPlan;
  nutritionTargets: NutritionTargets;
}

type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "super_active";

function toNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function generateUserPlan(profile: Profile): GeneratedPlan {
  // Weekly pace (only used for fat loss)
  const weeklyPace = parseFloat(
    String(profile.weekly_pace ?? profile.weeklyPace ?? localStorage.getItem("onboarding_weekly_pace") ?? "0.5")
  );

  // Goal
  const goalKey = normalizeGoal(
    String(profile.primary_goal ?? profile.goal ?? localStorage.getItem("onboarding_primary_goal") ?? "maintain")
  );

  // Gender / age / height
  const gender = (profile.gender ?? localStorage.getItem("onboarding_gender") ?? "male") as "male" | "female";
  const age = toNumber(profile.age ?? localStorage.getItem("onboarding_age"), 0);
  const heightCm = toNumber(
    profile.heightCm ?? profile.height_cm ?? profile.height ?? localStorage.getItem("onboarding_height"),
    0
  );

  // Weight (handle kg/lb)
  const weightRaw = toNumber(
    profile.weightKg ??
      profile.weight_kg ??
      profile.current_weight ??
      profile.weight ??
      localStorage.getItem("onboarding_current_weight"),
    0
  );

  const weightUnit = (profile.weight_unit ?? localStorage.getItem("onboarding_weight_unit") ?? "kg") as "kg" | "lb";
  const weightKg = weightUnit === "lb" ? weightRaw * 0.453592 : weightRaw;

  // Activity
  const activityLevel = (profile.activityLevel ??
    profile.activity_level ??
    localStorage.getItem("onboarding_activity_level") ??
    "moderately_active") as ActivityLevel;

  // ✅ Calculate targets using the NEW calculator input shape
  const nutritionTargets = calculateTDEE({
    weightKg,
    heightCm,
    age,
    gender,
    activityLevel,
    goal: goalKey,
    weeklyPace,
  });

  console.log("PLAN GEN PROFILE (raw):", JSON.stringify(profile));
  console.log(
    "PLAN GEN INPUTS:",
    JSON.stringify({ gender, age, heightCm, weightKg, activityLevel, goal: goalKey, weeklyPace })
  );
  console.log("NUTRITION TARGETS:", JSON.stringify(nutritionTargets));

  const mealTemplateKey = `${goalKey}_non_veg`;
  const mealTemplate: MealPlanTemplate = mealTemplates[mealTemplateKey] || mealTemplates["maintain_non_veg"];

  const workoutDays = workoutTemplates[goalKey] || workoutTemplates["maintain"];

  return {
    workoutPlan: { days: workoutDays },
    mealPlan: { days: mealTemplate },
    nutritionTargets,
  };
}
