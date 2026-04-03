export interface Profile {
  gender?: string;
  age?: number;
  current_weight?: number;
  weight_unit?: string;
  height?: number;
  height_unit?: string;
  activity_level?: string;
  primary_goal?: string;
}

export interface NutritionTargets {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateTDEE(profile: Profile): NutritionTargets {
  const gender = profile.gender || "male";
  const age = profile.age || 25;

  let weightKg = profile.current_weight || 70;
  if (profile.weight_unit === "lb") weightKg = weightKg * 0.453592;

  let heightCm = profile.height || 170;
  if (profile.height_unit === "ft-in" || profile.height_unit === "ft") {
    heightCm = heightCm * 30.48;
  }

  let bmr: number;
  if (gender === "female") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly: 1.375,
    lightly_active: 1.375,
    moderately: 1.55,
    moderately_active: 1.55,
    very_active: 1.725,
    super: 1.9,
    super_active: 1.9,
  };

  const multiplier = activityMultipliers[profile.activity_level || "sedentary"] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  const goalKey = normalizeGoal(profile.primary_goal);

  const goalAdjustments: Record<string, number> = {
    fat_loss: -500,
    muscle_gain: 300,
    maintain: 0,
  };

  const targetCalories = Math.round(tdee + (goalAdjustments[goalKey] || 0));

  const macroSplits: Record<string, { protein: number; carbs: number; fat: number }> = {
    fat_loss: { protein: 0.40, carbs: 0.30, fat: 0.30 },
    muscle_gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    maintain: { protein: 0.35, carbs: 0.40, fat: 0.25 },
  };

  const split = macroSplits[goalKey] || macroSplits.maintain;

  const protein = Math.round((targetCalories * split.protein) / 4);
  const carbs = Math.round((targetCalories * split.carbs) / 4);
  const fat = Math.round((targetCalories * split.fat) / 9);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    protein,
    carbs,
    fat,
  };
}

export function normalizeGoal(goal?: string): string {
  if (!goal) return "maintain";
  if (goal === "lose-fat" || goal === "fat_loss") return "fat_loss";
  if (goal === "gain-muscle" || goal === "muscle_gain") return "muscle_gain";
  return "maintain";
}
