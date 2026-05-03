export interface TDEEInputs {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active';
  goal: 'muscle_gain' | 'fat_loss' | 'maintain';
  weeklyPace?: number;
}

export interface TDEEResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calculateTDEE(inputs: TDEEInputs): TDEEResult {
  const { weightKg, heightCm, age, gender, activityLevel, goal, weeklyPace } = inputs;

  // Step 1 — BMR Mifflin-St Jeor
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Step 2 — Activity multiplier (corrected for Pakistani beginner reality)
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.55,      // shifted down — gym beginner is not scientifically very active
    super_active: 1.725,    // shifted down — reserved for serious athletes
  };

  const tdee = Math.round(bmr * multipliers[activityLevel]);

  // Step 3 — Target calories by goal
  let targetCalories: number;

  if (goal === 'muscle_gain') {
    // No surplus — TDEE only. Beginners gain muscle at TDEE.
    targetCalories = tdee;

  } else if (goal === 'fat_loss') {
    // Dynamic deficit based on weekly pace
    const pace = weeklyPace ?? 0.5;
    const deficit = Math.round(pace * 1100);
    const calculated = tdee - deficit;

    // Hard floor — never go below this
    const floor = gender === 'male' ? 1500 : 1200;
    targetCalories = Math.max(calculated, floor);

  } else {
    // Maintain — straight TDEE
    targetCalories = tdee;
  }

  // Step 4 — Macros
  const protein = Math.round(weightKg * (goal === 'fat_loss' ? 2.0 : goal === 'muscle_gain' ? 1.8 : 1.6));
  const fat = Math.round((targetCalories * 0.25) / 9);
  const remainingCalories = targetCalories - (protein * 4) - (fat * 9);
  const carbs = Math.round(remainingCalories / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    protein,
    carbs,
    fat,
  };
}

export function normalizeGoal(goal: string): 'muscle_gain' | 'fat_loss' | 'maintain' {
  if (goal === 'muscle_gain' || goal === 'fat_loss' || goal === 'maintain') {
    return goal;
  }
  return 'maintain';
}
