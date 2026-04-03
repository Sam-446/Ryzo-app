import { calculateTDEE, normalizeGoal, type Profile, type NutritionTargets } from "./tdeeCalculator";
import { workoutTemplates, type WorkoutDayTemplate } from "@/data/templates/workoutTemplates";
import { mealTemplates, type MealPlanTemplate, type DayMeals, type MealTemplate } from "@/data/templates/mealTemplates";

export interface GeneratedWorkoutPlan {
  days: WorkoutDayTemplate[];
}

export interface ScaledMeal extends MealTemplate {
  scale_factor: number;
}

export interface ScaledDayMeals {
  breakfast: ScaledMeal;
  lunch: ScaledMeal;
  snack: ScaledMeal;
  dinner: ScaledMeal;
}

export interface GeneratedMealPlan {
  days: ScaledDayMeals[];
}

export interface GeneratedPlan {
  workoutPlan: GeneratedWorkoutPlan;
  mealPlan: GeneratedMealPlan;
  nutritionTargets: NutritionTargets;
}

function normalizeDietType(diet?: string): "veg" | "non_veg" {
  if (!diet) return "non_veg";
  const lower = diet.toLowerCase();
  if (lower === "veg" || lower === "vegetarian" || lower.includes("veg")) return "veg";
  return "non_veg";
}

function scaleMeal(meal: MealTemplate, scaleFactor: number): ScaledMeal {
  return {
    ...meal,
    calories: Math.round(meal.calories * scaleFactor),
    protein: Math.round(meal.protein * scaleFactor),
    carbs: Math.round(meal.carbs * scaleFactor),
    fat: Math.round(meal.fat * scaleFactor),
    scale_factor: scaleFactor,
  };
}

function scaleDayMeals(day: DayMeals, targetDailyCalories: number): ScaledDayMeals {
  const templateDailyCalories =
    day.breakfast.calories +
    day.lunch.calories +
    day.snack.calories +
    day.dinner.calories;

  const scaleFactor = templateDailyCalories > 0
    ? targetDailyCalories / templateDailyCalories
    : 1;

  return {
    breakfast: scaleMeal(day.breakfast, scaleFactor),
    lunch: scaleMeal(day.lunch, scaleFactor),
    snack: scaleMeal(day.snack, scaleFactor),
    dinner: scaleMeal(day.dinner, scaleFactor),
  };
}

export function generateUserPlan(profile: Profile): GeneratedPlan {
  const nutritionTargets = calculateTDEE(profile);
  const goalKey = normalizeGoal(profile.primary_goal);
  const dietKey = normalizeDietType(profile.diet_type as string);

  const workoutDays = workoutTemplates[goalKey] || workoutTemplates.maintain;
  const mealTemplateKey = `${goalKey}_${dietKey}`;
  const mealTemplate: MealPlanTemplate =
    mealTemplates[mealTemplateKey] || mealTemplates["maintain_non_veg"];

  const scaledDays = mealTemplate.map((day) =>
    scaleDayMeals(day, nutritionTargets.targetCalories)
  );

  return {
    workoutPlan: { days: workoutDays },
    mealPlan: { days: scaledDays },
    nutritionTargets,
  };
}
