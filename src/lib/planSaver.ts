import { supabase } from "./supabase";
import { type GeneratedPlan } from "./planGenerator";

// ─────────────────────────────────────────
// MEAT NUTRITION PER 100G
// ─────────────────────────────────────────
const MEAT = {
  chicken: { protein: 31, calories: 165, fat: 3.6, carbs: 0 },
  beef:    { protein: 26, calories: 215, fat: 12,  carbs: 0 },
};

// ─────────────────────────────────────────
// FOOD CONSTANTS
// ─────────────────────────────────────────
const FOOD = {
  egg:        { calories: 70,  protein: 6,   carbs: 0.5, fat: 5   },
  chapati:    { calories: 120, protein: 3.5, carbs: 25,  fat: 1   },
  milk350:    { calories: 210, protein: 10,  carbs: 16,  fat: 11  },
  yogurt100:  { calories: 60,  protein: 4,   carbs: 3,   fat: 3   },
  oil1tsp:    { calories: 45,  protein: 0,   carbs: 0,   fat: 5   },
  rice100g:   { calories: 130, protein: 2.7, carbs: 28,  fat: 0.3 },
  potato:     { calories: 130, protein: 3,   carbs: 30,  fat: 0.1 },
  peanuts10g: { calories: 57,  protein: 2.5, carbs: 1.7, fat: 4.9 },
};

type MealMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// ─────────────────────────────────────────
// MUSCLE GAIN ENGINE — SCALABLE
// ─────────────────────────────────────────
function buildMuscleGainPlan(weightKg: number, meatType: "chicken" | "beef") {
  const bmr = 10 * weightKg + 6.25 * 178 - 5 * 23 + 5;
  const proteinTarget = Math.round(weightKg * 1.8);
  const breakfastWith3Eggs =
    FOOD.egg.calories * 3 +
    FOOD.chapati.calories * 2 +
    FOOD.milk350.calories;
  return { proteinTarget };
}

// ─────────────────────────────────────────
// CORE ENGINE — MUSCLE GAIN
// ─────────────────────────────────────────
function calculateMuscleGainDay(
  targetCalories: number,
  weightKg: number,
  meatType: "chicken" | "beef"
): {
  breakfast: MealMacros;
  lunch: MealMacros;
  snack: MealMacros;
  dinner: MealMacros;
  eggCount: number;
  chickenGrams: number;
  riceGrams: number;
  chapatiLunch: number;
  peanutGrams: number;
} {
  const meatData = MEAT[meatType];
  const proteinTarget = Math.round(weightKg * 1.8);
  const breakfastBase = FOOD.chapati.calories * 2 + FOOD.milk350.calories;

  let eggCount = 3;
  let breakfastCalories = breakfastBase + FOOD.egg.calories * eggCount;
  const breakfastPercent = breakfastCalories / targetCalories;

  if (breakfastPercent < 0.22) {
    eggCount = 4;
    breakfastCalories = breakfastBase + FOOD.egg.calories * 4;
  } else if (breakfastPercent > 0.30) {
    eggCount = 2;
    breakfastCalories = breakfastBase + FOOD.egg.calories * 2;
  }

  const breakfastProtein = Math.round(
    FOOD.egg.protein * eggCount +
    FOOD.chapati.protein * 2 +
    FOOD.milk350.protein
  );
  const breakfastCarbs = Math.round(
    FOOD.egg.carbs * eggCount +
    FOOD.chapati.carbs * 2 +
    FOOD.milk350.carbs
  );
  const breakfastFat = Math.round(
    FOOD.egg.fat * eggCount +
    FOOD.chapati.fat * 2 +
    FOOD.milk350.fat
  );

  const snackEggCal = FOOD.egg.calories;
  const snackPotatoCal = FOOD.potato.calories * 2;
  const peanutBase30 = FOOD.peanuts10g.calories * 3;
  const snackBaseCalories = snackEggCal + snackPotatoCal;
  const snackBaseProtein = Math.round(
    FOOD.egg.protein + FOOD.potato.protein * 2
  );
  const snackPeanutProtein30 = Math.round(FOOD.peanuts10g.protein * 3);
  const fixedProtein = breakfastProtein + snackBaseProtein + snackPeanutProtein30;

  const proteinFromMeat = Math.max(0, proteinTarget - fixedProtein);
  const proteinPerMeal = proteinFromMeat / 2;
  let chickenGrams = Math.round((proteinPerMeal / meatData.protein) * 100);
  chickenGrams = Math.round(chickenGrams / 5) * 5;
  chickenGrams = Math.min(220, Math.max(90, chickenGrams));

  const chickenCalPerMeal = Math.round((chickenGrams * meatData.calories) / 100);
  const fixedSidesPerMeal =
    FOOD.yogurt100.calories +
    FOOD.oil1tsp.calories +
    FOOD.chapati.calories;

  const usedCalories =
    breakfastCalories +
    snackBaseCalories + peanutBase30 +
    (chickenCalPerMeal + fixedSidesPerMeal) * 2;

  const remainingCalories = targetCalories - usedCalories;
  const riceCaloriesPerMeal = remainingCalories / 2;
  let riceGrams = Math.round((riceCaloriesPerMeal / FOOD.rice100g.calories) * 100);
  riceGrams = Math.round(riceGrams / 10) * 10;

  let chapatiLunch = 1;
  let extraChapatiCalories = 0;
  if (riceGrams > 260) {
    riceGrams = 260;
    chapatiLunch = 2;
    extraChapatiCalories = FOOD.chapati.calories;
  }

  const riceCalActual = Math.round((riceGrams * FOOD.rice100g.calories) / 100);
  const mainMealCal = chickenCalPerMeal + fixedSidesPerMeal + riceCalActual + extraChapatiCalories;
  const totalWithBase = breakfastCalories + snackBaseCalories + mainMealCal * 2;

  const calGap = targetCalories - totalWithBase;
  let peanutGrams = 30;
  if (calGap > 0) {
    const extraPeanut10g = Math.round(calGap / FOOD.peanuts10g.calories);
    peanutGrams = 30 + extraPeanut10g * 10;
  }
  peanutGrams = Math.min(40, Math.max(20, peanutGrams));

  const peanutUnits = peanutGrams / 10;
  const snackCalories = Math.round(snackBaseCalories + FOOD.peanuts10g.calories * peanutUnits);
  const snackProtein = Math.round(snackBaseProtein + FOOD.peanuts10g.protein * peanutUnits);
  const snackCarbs = Math.round(
    FOOD.egg.carbs + FOOD.potato.carbs * 2 + FOOD.peanuts10g.carbs * peanutUnits
  );
  const snackFat = Math.round(
    FOOD.egg.fat + FOOD.potato.fat * 2 + FOOD.peanuts10g.fat * peanutUnits
  );

  const chickenProteinPerMeal = Math.round((chickenGrams * meatData.protein) / 100);
  const chickenFatPerMeal = Math.round((chickenGrams * meatData.fat) / 100);
  const riceProtein = Math.round((riceGrams * FOOD.rice100g.protein) / 100);
  const riceCarbs = Math.round((riceGrams * FOOD.rice100g.carbs) / 100);
  const riceFat = Math.round((riceGrams * FOOD.rice100g.fat) / 100);

  const mainProtein = Math.round(
    chickenProteinPerMeal + riceProtein +
    FOOD.chapati.protein * chapatiLunch + FOOD.yogurt100.protein
  );
  const mainCarbs = Math.round(
    riceCarbs + FOOD.chapati.carbs * chapatiLunch + FOOD.yogurt100.carbs
  );
  const mainFat = Math.round(
    chickenFatPerMeal + riceFat +
    FOOD.chapati.fat * chapatiLunch +
    FOOD.yogurt100.fat + FOOD.oil1tsp.fat
  );
  const mainCalories = Math.round(
    chickenCalPerMeal + riceCalActual +
    FOOD.chapati.calories * chapatiLunch +
    FOOD.yogurt100.calories + FOOD.oil1tsp.calories
  );

  return {
    breakfast: {
      calories: Math.round(breakfastCalories),
      protein: breakfastProtein,
      carbs: breakfastCarbs,
      fat: breakfastFat,
    },
    lunch: { calories: mainCalories, protein: mainProtein, carbs: mainCarbs, fat: mainFat },
    snack: { calories: snackCalories, protein: snackProtein, carbs: snackCarbs, fat: snackFat },
    dinner: { calories: mainCalories, protein: mainProtein, carbs: mainCarbs, fat: mainFat },
    eggCount,
    chickenGrams,
    riceGrams,
    chapatiLunch,
    peanutGrams,
  };
}

// ─────────────────────────────────────────
// FAT LOSS ENGINE — MACRO-DRIVEN
// ─────────────────────────────────────────
function calculateFatLossDay(
  targetCalories: number,
  weightKg: number,
  meatType: "chicken" | "beef"
): {
  breakfast: MealMacros;
  lunch: MealMacros;
  snack: MealMacros;
  dinner: MealMacros;
  chickenGrams: number;
  riceGrams: number;
} {
  const meatData = MEAT[meatType];
  const proteinTarget = Math.round(weightKg * 2.0);

  const breakfast: MealMacros = {
    calories: 355,
    protein: 23,
    carbs: 26,
    fat: 17,
  };

  // Real snack for fat loss — boiled egg + green tea
  const snack: MealMacros = {
    calories: 75,
    protein: 6,
    carbs: 1,
    fat: 5,
  };

  const proteinRemaining = Math.max(0, proteinTarget - breakfast.protein - snack.protein);
  const proteinPerMeal = proteinRemaining / 2;

  let chickenGrams = Math.round((proteinPerMeal / meatData.protein) * 100);
  chickenGrams = Math.round(chickenGrams / 5) * 5;

  // For beef — cap lower because beef is high fat
  if (meatType === "beef") {
    chickenGrams = Math.min(180, Math.max(80, chickenGrams));
  } else {
    chickenGrams = Math.min(250, Math.max(100, chickenGrams));
  }

  const chickenCal = Math.round((chickenGrams * meatData.calories) / 100);
  const chickenProtein = Math.round((chickenGrams * meatData.protein) / 100);
  const chickenFat = Math.round((chickenGrams * meatData.fat) / 100);
  const oilCal = FOOD.oil1tsp.calories;

  const usedCalories =
    breakfast.calories + snack.calories + (chickenCal + oilCal) * 2;

  const remainingCalories = Math.max(0, targetCalories - usedCalories);
  const riceCalPerMeal = remainingCalories / 2;

  let riceGrams = Math.round((riceCalPerMeal / FOOD.rice100g.calories) * 100);
  riceGrams = Math.round(riceGrams / 10) * 10;
  riceGrams = Math.min(200, Math.max(40, riceGrams));

  const riceCalActual = Math.round((riceGrams * FOOD.rice100g.calories) / 100);
  const riceProtein = Math.round((riceGrams * FOOD.rice100g.protein) / 100);
  const riceCarbs = Math.round((riceGrams * FOOD.rice100g.carbs) / 100);
  const riceFat = Math.round((riceGrams * FOOD.rice100g.fat) / 100);

  const mainMeal: MealMacros = {
    calories: chickenCal + riceCalActual + oilCal,
    protein: chickenProtein + riceProtein,
    carbs: riceCarbs,
    fat: chickenFat + riceFat + FOOD.oil1tsp.fat,
  };

  return {
    breakfast,
    lunch: mainMeal,
    snack,
    dinner: mainMeal,
    chickenGrams,
    riceGrams,
  };
}
// ─────────────────────────────────────────
// ✅ MAINTAIN ENGINE — MACRO-DRIVEN
// ─────────────────────────────────────────
function calculateMaintainDay(
  targetCalories: number,
  weightKg: number,
  meatType: "chicken" | "beef"
): {
  breakfast: MealMacros;
  lunch: MealMacros;
  snack: MealMacros;
  dinner: MealMacros;
  chickenGrams: number;
  riceGrams: number;
  chapatiLunch: number;
} {
  const meatData = MEAT[meatType];
  const proteinTarget = Math.round(weightKg * 1.6);

  // Breakfast: 3 eggs + 1 chapati + 100g yogurt
  const breakfast: MealMacros = {
    calories: Math.round(
      FOOD.egg.calories * 3 +
      FOOD.chapati.calories +
      FOOD.yogurt100.calories
    ),
    protein: Math.round(
      FOOD.egg.protein * 3 +
      FOOD.chapati.protein +
      FOOD.yogurt100.protein
    ),
    carbs: Math.round(
      FOOD.egg.carbs * 3 +
      FOOD.chapati.carbs +
      FOOD.yogurt100.carbs
    ),
    fat: Math.round(
      FOOD.egg.fat * 3 +
      FOOD.chapati.fat +
      FOOD.yogurt100.fat
    ),
  };

  // Snack: 1 egg + 1 banana
  const snack: MealMacros = {
    calories: 160,
    protein: 7,
    carbs: 24,
    fat: 5,
  };

  // Protein remaining after breakfast + snack
  const proteinFixed = breakfast.protein + snack.protein;
  const proteinRemaining = Math.max(0, proteinTarget - proteinFixed);
  const proteinPerMeal = proteinRemaining / 2;

  let chickenGrams = Math.round((proteinPerMeal / meatData.protein) * 100);
  chickenGrams = Math.round(chickenGrams / 5) * 5;
  chickenGrams = Math.min(220, Math.max(80, chickenGrams));

  const chickenCal = Math.round((chickenGrams * meatData.calories) / 100);
  const chickenProtein = Math.round((chickenGrams * meatData.protein) / 100);
  const chickenFat = Math.round((chickenGrams * meatData.fat) / 100);

  // Fixed sides: 1 chapati + 100g yogurt + 1 tsp oil
  const fixedSidesCal =
    FOOD.chapati.calories +
    FOOD.yogurt100.calories +
    FOOD.oil1tsp.calories;

  const usedCalories =
    breakfast.calories +
    snack.calories +
    (chickenCal + fixedSidesCal) * 2;

  const remaining = targetCalories - usedCalories;

  let riceGrams = Math.round((remaining / 2 / FOOD.rice100g.calories) * 100);
  riceGrams = Math.round(riceGrams / 10) * 10;

  let chapatiLunch = 1;
  if (riceGrams > 240) {
    riceGrams = 240;
    chapatiLunch = 2;
  }
  riceGrams = Math.max(80, riceGrams);

  const riceCalActual = Math.round((riceGrams * FOOD.rice100g.calories) / 100);
  const riceProtein = Math.round((riceGrams * FOOD.rice100g.protein) / 100);
  const riceCarbs = Math.round((riceGrams * FOOD.rice100g.carbs) / 100);
  const riceFat = Math.round((riceGrams * FOOD.rice100g.fat) / 100);

  const mainMeal: MealMacros = {
    calories: Math.round(
      chickenCal +
      riceCalActual +
      FOOD.chapati.calories * chapatiLunch +
      FOOD.yogurt100.calories +
      FOOD.oil1tsp.calories
    ),
    protein: Math.round(
      chickenProtein +
      riceProtein +
      FOOD.chapati.protein * chapatiLunch +
      FOOD.yogurt100.protein
    ),
    carbs: Math.round(
      riceCarbs +
      FOOD.chapati.carbs * chapatiLunch +
      FOOD.yogurt100.carbs
    ),
    fat: Math.round(
      chickenFat +
      riceFat +
      FOOD.chapati.fat * chapatiLunch +
      FOOD.yogurt100.fat +
      FOOD.oil1tsp.fat
    ),
  };

  return {
    breakfast,
    lunch: mainMeal,
    snack,
    dinner: mainMeal,
    chickenGrams,
    riceGrams,
    chapatiLunch,
  };
}

// ─────────────────────────────────────────
// DETECT MEAT TYPE
// ─────────────────────────────────────────
function getMeatType(mealName: string): "chicken" | "beef" {
  const lower = mealName.toLowerCase();
  if (lower.includes("beef") || lower.includes("qeema")) return "beef";
  return "chicken";
}

// ─────────────────────────────────────────
// CALCULATE MEAT GRAMS (fallback only)
// ─────────────────────────────────────────
function calculateMeatGrams(
  weightKg: number,
  goalKey: string,
  meatType: "chicken" | "beef"
): number {
  const proteinPerKg =
    goalKey === "fat_loss" ? 2.0 : goalKey === "muscle_gain" ? 1.8 : 1.6;
  const dailyProteinTarget = Math.round(weightKg * proteinPerKg);
  const proteinFromMeat = Math.max(0, dailyProteinTarget - 40);
  const proteinPerMeal = proteinFromMeat / 2;
  const meatGrams = Math.round((proteinPerMeal / MEAT[meatType].protein) * 100);
  return Math.min(220, Math.max(60, meatGrams));
}

// ─────────────────────────────────────────
// BUILD PERSONALIZED MEAL
// ─────────────────────────────────────────
function buildPersonalizedMeal(
  meal: {
    meal_type: string;
    meal_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    cooking_time: string;
    serving_size: string;
    ingredients: string[];
    preparation_steps: string[];
    batch_cook_tip?: string;
    reheat_note?: string;
  },
  meatGrams: number,
  meatType: "chicken" | "beef",
  goalKey: string,
  muscleDay: ReturnType<typeof calculateMuscleGainDay> | null,
  fatLossDay: ReturnType<typeof calculateFatLossDay> | null,
  maintainDay: ReturnType<typeof calculateMaintainDay> | null
) {
  // ── MUSCLE GAIN ──
  if (goalKey === "muscle_gain" && muscleDay) {
    if (meal.meal_type === "breakfast") {
      const eggCount = muscleDay.eggCount;
      return {
        ...meal,
        calories: muscleDay.breakfast.calories,
        protein:  muscleDay.breakfast.protein,
        carbs:    muscleDay.breakfast.carbs,
        fat:      muscleDay.breakfast.fat,
        serving_size: `${eggCount} eggs + 2 chapati + 350ml milk`,
        ingredients: [
          `${eggCount} eggs`,
          "2 whole wheat chapatis",
          "350ml full cream milk",
          "1 tsp butter or oil",
          "salt",
          "black pepper",
        ],
        preparation_steps: [
          `Fry ${eggCount} eggs in butter — sunny side or over easy`,
          "Make 2 chapatis on tawa",
          "Warm the milk (350ml)",
          "Eat eggs with chapati and drink milk",
        ],
      };
    }

    if (meal.meal_type === "snack") {
      const { peanutGrams } = muscleDay;
      return {
        ...meal,
        calories: muscleDay.snack.calories,
        protein:  muscleDay.snack.protein,
        carbs:    muscleDay.snack.carbs,
        fat:      muscleDay.snack.fat,
        serving_size: `1 boiled egg + 2 medium boiled potatoes + ${peanutGrams}g peanuts`,
        ingredients: [
          "2 medium boiled potatoes",
          "1 egg",
          `${peanutGrams}g peanuts (moong phali)`,
          "salt",
          "black pepper",
        ],
        preparation_steps: [
          "Boil 2 potatoes and 1 egg together",
          "Season with salt and pepper",
          `Eat with ${peanutGrams}g peanuts on the side`,
          "Good pre-workout energy boost",
        ],
      };
    }

    if (meal.meal_type === "lunch" || meal.meal_type === "dinner") {
      const { chickenGrams, riceGrams, chapatiLunch } = muscleDay;
      const cookAllGrams = chickenGrams * 2;
      const isLunch = meal.meal_type === "lunch";
      const chapatiText =
        chapatiLunch === 2 ? "2 whole wheat chapatis" : "1 whole wheat chapati";

      const updatedIngredients = isLunch
        ? [
            `${cookAllGrams}g ${meatType} — cook all, eat ${chickenGrams}g now, save rest for dinner`,
            `${riceGrams * 2}g rice (cooked total) — eat ${riceGrams}g now, save ${riceGrams}g for dinner`,
            chapatiText,
            "100g plain yogurt",
            "1 onion",
            "2 tomatoes",
            "ginger garlic paste",
            "salt — cumin — coriander powder",
            "1 tsp oil",
          ]
        : [
            `${chickenGrams}g ${meatType} — saved from lunch`,
            `${riceGrams}g rice (cooked) — reheated from lunch`,
            chapatiText,
            "100g plain yogurt",
          ];

      const updatedSteps = isLunch
        ? [
            `Cook all ${cookAllGrams}g ${meatType} karahi style with tomatoes and spices`,
            "Cook rice",
            `Make ${chapatiLunch === 2 ? "2 chapatis" : "1 chapati"} on tawa`,
            "Season yogurt with salt and cumin",
            `Eat ${chickenGrams}g ${meatType} now with rice, chapati, yogurt`,
            `Save rest of ${meatType} and ${riceGrams}g rice for dinner`,
          ]
        : [
            `Reheat saved ${meatType} and rice`,
            `Make ${chapatiLunch === 2 ? "2 chapatis" : "1 chapati"} fresh if preferred`,
            "Eat with yogurt",
          ];

      return {
        ...meal,
        calories: muscleDay.lunch.calories,
        protein:  muscleDay.lunch.protein,
        carbs:    muscleDay.lunch.carbs,
        fat:      muscleDay.lunch.fat,
        serving_size: `${chickenGrams}g ${meatType} + ${riceGrams}g rice + ${chapatiLunch} chapati + 100g yogurt`,
        ingredients: updatedIngredients,
        preparation_steps: updatedSteps,
      };
    }
  }

  // ── FAT LOSS ──
  if (goalKey === "fat_loss" && fatLossDay) {
    if (meal.meal_type === "breakfast") {
      return {
        ...meal,
        calories: fatLossDay.breakfast.calories,
        protein:  fatLossDay.breakfast.protein,
        carbs:    fatLossDay.breakfast.carbs,
        fat:      fatLossDay.breakfast.fat,
        serving_size: "3 eggs + 2 bread slices + black coffee",
        ingredients: [
          "3 eggs",
          "2 slices bread (double roti)",
          "1 cup black coffee — no sugar no milk",
          "salt",
          "black pepper",
        ],
        preparation_steps: [
          "Boil or fry 3 eggs",
          "Toast bread lightly",
          "Make black coffee — no sugar no milk",
          "Eat eggs with bread",
        ],
      };
    }

    if (meal.meal_type === "snack") {
      return {
        ...meal,
        calories: fatLossDay.snack.calories,
        protein:  fatLossDay.snack.protein,
        carbs:    fatLossDay.snack.carbs,
        fat:      fatLossDay.snack.fat,
        serving_size: "1 boiled egg + green tea",
        ingredients: [
          "1 boiled egg",
          "1 cup green tea — no sugar",
        ],
        preparation_steps: [
          "Boil 1 egg",
          "Make green tea without sugar",
          "Keeps you full between meals",
        ],
      };
    }
    if (meal.meal_type === "lunch" || meal.meal_type === "dinner") {
      const { chickenGrams, riceGrams } = fatLossDay;
      const cookAllGrams = chickenGrams * 2;
      const isLunch = meal.meal_type === "lunch";

      const updatedIngredients = isLunch
        ? [
            `${cookAllGrams}g ${meatType} — cook all, eat ${chickenGrams}g now, save rest for dinner`,
            `${riceGrams * 2}g rice (cooked total) — eat ${riceGrams}g now, save ${riceGrams}g for dinner`,
            "1 tomato",
            "1 cucumber",
            "lemon juice",
            "salt",
            "black pepper",
            "1 tsp oil",
            "cumin powder",
          ]
        : [
            `${chickenGrams}g ${meatType} — saved from lunch`,
            `${riceGrams}g rice (cooked) — reheated from lunch`,
          ];

      const updatedSteps = isLunch
        ? [
            `Cook all ${cookAllGrams}g ${meatType} with salt, cumin, lemon, 1 tsp oil`,
            "Cook rice",
            `Eat ${chickenGrams}g ${meatType} now with ${riceGrams}g rice and salad`,
            `Save ${chickenGrams}g ${meatType} and ${riceGrams}g rice for dinner`,
          ]
        : [
            `Reheat ${chickenGrams}g ${meatType} in pan for 4 minutes`,
            "Reheat rice",
            "Squeeze fresh lemon if available",
            "Eat and recover",
          ];

      return {
        ...meal,
        calories: fatLossDay.lunch.calories,
        protein:  fatLossDay.lunch.protein,
        carbs:    fatLossDay.lunch.carbs,
        fat:      fatLossDay.lunch.fat,
        serving_size: `${chickenGrams}g ${meatType} + ${riceGrams}g rice`,
        ingredients: updatedIngredients,
        preparation_steps: updatedSteps,
      };
    }
  }

  // ── MAINTAIN ──
  if (goalKey === "maintain" && maintainDay) {
    if (meal.meal_type === "breakfast") {
      return {
        ...meal,
        calories: Math.round(maintainDay.breakfast.calories),
        protein:  Math.round(maintainDay.breakfast.protein),
        carbs:    Math.round(maintainDay.breakfast.carbs),
        fat:      Math.round(maintainDay.breakfast.fat),
        serving_size: "3 eggs + 1 chapati + 100g yogurt",
        ingredients: [
          "3 eggs",
          "1 whole wheat chapati",
          "100g plain yogurt",
          "salt",
          "black pepper",
        ],
        preparation_steps: [
          "Boil or fry 3 eggs",
          "Make 1 chapati on tawa",
          "Serve eggs with chapati and yogurt on side",
        ],
      };
    }

    if (meal.meal_type === "snack") {
      return {
        ...meal,
        calories: Math.round(maintainDay.snack.calories),
        protein:  Math.round(maintainDay.snack.protein),
        carbs:    Math.round(maintainDay.snack.carbs),
        fat:      Math.round(maintainDay.snack.fat),
        serving_size: "1 boiled egg + 1 banana",
        ingredients: [
          "1 boiled egg",
          "1 banana",
        ],
        preparation_steps: [
          "Boil egg",
          "Eat with banana",
          "Good pre-workout energy",
        ],
      };
    }

    if (meal.meal_type === "lunch" || meal.meal_type === "dinner") {
      const { chickenGrams, riceGrams, chapatiLunch } = maintainDay;
      const cookAllGrams = chickenGrams * 2;
      const isLunch = meal.meal_type === "lunch";
      const chapatiText =
        chapatiLunch === 2 ? "2 whole wheat chapatis" : "1 whole wheat chapati";

      const updatedIngredients = isLunch
        ? [
            `${cookAllGrams}g ${meatType} — cook all, eat ${chickenGrams}g now, save rest for dinner`,
            `${riceGrams * 2}g rice (cooked total) — eat ${riceGrams}g now, save ${riceGrams}g for dinner`,
            chapatiText,
            "100g plain yogurt",
            "1 onion",
            "2 tomatoes",
            "ginger garlic paste",
            "salt — cumin — coriander powder",
            "1 tsp oil",
          ]
        : [
            `${chickenGrams}g ${meatType} — saved from lunch`,
            `${riceGrams}g rice (cooked) — reheated from lunch`,
            chapatiText,
            "100g plain yogurt",
          ];

      const updatedSteps = isLunch
        ? [
            `Cook ${meatType} with tomatoes and spices`,
            "Cook rice",
            `Make ${chapatiLunch === 2 ? "2 chapatis" : "1 chapati"} on tawa`,
            "Season yogurt with salt and cumin",
            `Eat ${chickenGrams}g ${meatType} now with rice, chapati, yogurt`,
            `Save rest of ${meatType} and ${riceGrams}g rice for dinner`,
          ]
        : [
            `Reheat saved ${meatType} and rice`,
            `Make ${chapatiLunch === 2 ? "2 chapatis" : "1 chapati"} fresh`,
            "Eat with yogurt",
          ];

      return {
        ...meal,
        calories: Math.round(maintainDay.lunch.calories),
        protein:  Math.round(maintainDay.lunch.protein),
        carbs:    Math.round(maintainDay.lunch.carbs),
        fat:      Math.round(maintainDay.lunch.fat),
        serving_size: `${chickenGrams}g ${meatType} + ${riceGrams}g rice + ${chapatiLunch} chapati + 100g yogurt`,
        ingredients: updatedIngredients,
        preparation_steps: updatedSteps,
      };
    }
  }

  return meal;
}

// ─────────────────────────────────────────
// DETERMINE GOAL KEY
// ─────────────────────────────────────────
function getGoalKey(primaryGoal?: string): string {
  if (!primaryGoal) return "maintain";
  const g = primaryGoal.toLowerCase();
  if (g.includes("fat") || g.includes("loss") || g.includes("lose")) return "fat_loss";
  if (g.includes("muscle") || g.includes("gain")) return "muscle_gain";
  return "maintain";
}

// ─────────────────────────────────────────
// MAIN SAVE FUNCTION
// ─────────────────────────────────────────
export async function saveUserPlan(
  userId: string,
  generatedPlan: GeneratedPlan
): Promise<{ error: string | null }> {
  const { workoutPlan, mealPlan, nutritionTargets } = generatedPlan;
  const nt: any = nutritionTargets as any;

  try {
    if (typeof nt.wasCapped === "boolean") {
      await supabase
        .from("profiles")
        .update({ calories_capped: nt.wasCapped })
        .eq("id", userId);
    }

    await supabase
      .from("workout_plans")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true);

    await supabase
      .from("meal_plans")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true);

    // ── WORKOUT PLAN ──
    const { data: wpData, error: wpError } = await supabase
      .from("workout_plans")
      .insert({
        user_id: userId,
        plan_name: "My Personalized Workout Plan",
        split_type: "bro_split",
        generated_at: new Date().toISOString(),
        expires_at: null,
        is_active: true,
      })
      .select("id")
      .single();

    if (wpError || !wpData)
      return { error: wpError?.message || "Failed to create workout plan" };
    const workoutPlanId = wpData.id;

    for (const day of workoutPlan.days) {
      const { data: wdData, error: wdError } = await supabase
        .from("workout_days")
        .insert({
          workout_plan_id: workoutPlanId,
          day_name: day.day_name,
          day_number: day.day_of_week,
          muscle_group: day.focus,
          is_rest_day: day.is_rest_day,
          total_exercises: day.exercises?.length || 0,
          estimated_duration: day.is_rest_day ? 0 : 45,
        })
        .select("id")
        .single();

      if (wdError || !wdData)
        return { error: wdError?.message || "Failed to create workout day" };
      const workoutDayId = wdData.id;

      if (!day.is_rest_day && day.exercises?.length > 0) {
        const exerciseRows = day.exercises.map((ex: any, index: number) => ({
          workout_day_id: workoutDayId,
          exercise_name:  ex.exercise_name,
          demo_title:     ex.demo_title || ex.exercise_name,
          demo_url:       null,
          order_index:    ex.order_index ?? index,
          target_sets:    ex.target_sets || 3,
          target_reps:    ex.target_reps || "10-12",
          target_kg:      ex.target_kg || 20,
        }));
        const { error: exError } = await supabase
          .from("exercises")
          .insert(exerciseRows);
        if (exError) return { error: exError.message };
      }
    }

    // ── MEAL PLAN ──
    const weightKg =
      Number(nt.weightKg || 0) ||
      Number(localStorage.getItem("onboarding_current_weight") || 0) ||
      70;

    const rawGoal =
      typeof window !== "undefined"
        ? localStorage.getItem("onboarding_primary_goal") || ""
        : "";
    const goalKey = getGoalKey(rawGoal);

    const targetDailyCalories = Math.round(
      Number(nt.targetCalories ?? nt.target_daily_calories ?? 0)
    );

    const allPersonalizedDays = mealPlan.days.map((day: any) => {
      const meatType = getMeatType(day.lunch.meal_name);

      const dayMuscleData =
        goalKey === "muscle_gain" && targetDailyCalories > 0
          ? calculateMuscleGainDay(targetDailyCalories, weightKg, meatType)
          : null;

      const dayFatLossData =
        goalKey === "fat_loss" && targetDailyCalories > 0
          ? calculateFatLossDay(targetDailyCalories, weightKg, meatType)
          : null;

      const dayMaintainData =
        goalKey === "maintain" && targetDailyCalories > 0
          ? calculateMaintainDay(targetDailyCalories, weightKg, meatType)
          : null;

      const meatGrams =
        goalKey === "muscle_gain"
          ? dayMuscleData?.chickenGrams ?? 90
          : goalKey === "fat_loss"
          ? dayFatLossData?.chickenGrams ?? 100
          : goalKey === "maintain"
          ? dayMaintainData?.chickenGrams ?? 80
          : calculateMeatGrams(weightKg, goalKey, meatType);

      return {
        breakfast: buildPersonalizedMeal(
          day.breakfast, meatGrams, meatType, goalKey,
          dayMuscleData, dayFatLossData, dayMaintainData
        ),
        lunch: buildPersonalizedMeal(
          day.lunch, meatGrams, meatType, goalKey,
          dayMuscleData, dayFatLossData, dayMaintainData
        ),
        snack: buildPersonalizedMeal(
          day.snack, meatGrams, meatType, goalKey,
          dayMuscleData, dayFatLossData, dayMaintainData
        ),
        dinner: buildPersonalizedMeal(
          day.dinner, meatGrams, meatType, goalKey,
          dayMuscleData, dayFatLossData, dayMaintainData
        ),
      };
    });

    const day1 = allPersonalizedDays[0];
    const actualDailyCalories =
      day1.breakfast.calories + day1.lunch.calories +
      day1.snack.calories + day1.dinner.calories;
    const actualProtein =
      day1.breakfast.protein + day1.lunch.protein +
      day1.snack.protein + day1.dinner.protein;
    const actualCarbs =
      day1.breakfast.carbs + day1.lunch.carbs +
      day1.snack.carbs + day1.dinner.carbs;
    const actualFat =
      day1.breakfast.fat + day1.lunch.fat +
      day1.snack.fat + day1.dinner.fat;

    const targetProtein = Math.round(Number(nt.protein ?? nt.proteinGrams ?? 0));
    const targetCarbs   = Math.round(Number(nt.carbs   ?? nt.carbsGrams   ?? 0));
    const targetFat     = Math.round(Number(nt.fat     ?? nt.fatGrams     ?? 0));

    const { data: mpData, error: mpError } = await supabase
      .from("meal_plans")
      .insert({
        user_id:               userId,
        plan_name:             "My Personalized Meal Plan",
        total_daily_calories:  actualDailyCalories,
        total_protein:         actualProtein,
        total_carbs:           actualCarbs,
        total_fat:             actualFat,
        target_daily_calories: targetDailyCalories || null,
        target_protein:        targetProtein        || null,
        target_carbs:          targetCarbs          || null,
        target_fat:            targetFat            || null,
        generated_at:          new Date().toISOString(),
        expires_at:            null,
        is_active:             true,
      })
      .select("id")
      .single();

    if (mpError || !mpData)
      return { error: mpError?.message || "Failed to create meal plan" };
    const mealPlanId = mpData.id;

    const dayNames = [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ];

    for (let i = 0; i < allPersonalizedDays.length; i++) {
      const day = allPersonalizedDays[i];
      const dayCalories =
        day.breakfast.calories + day.lunch.calories +
        day.snack.calories + day.dinner.calories;

      const { data: mdData, error: mdError } = await supabase
        .from("meal_days")
        .insert({
          meal_plan_id:   mealPlanId,
          day_name:       dayNames[i] || `Day ${i + 1}`,
          day_number:     i + 1,
          total_calories: dayCalories,
        })
        .select("id")
        .single();

      if (mdError || !mdData)
        return { error: mdError?.message || "Failed to create meal day" };
      const mealDayId = mdData.id;

      const mealsToInsert = [
        day.breakfast,
        day.lunch,
        day.snack,
        day.dinner,
      ].map((meal: any) => ({
        meal_day_id:       mealDayId,
        meal_type:         meal.meal_type,
        meal_name:         meal.meal_name,
        calories:          meal.calories,
        protein:           meal.protein,
        carbs:             meal.carbs,
        fat:               meal.fat,
        cooking_time:      meal.cooking_time,
        serving_size:      meal.serving_size,
        ingredients:       meal.ingredients,
        preparation_steps: meal.preparation_steps,
      }));

      const { error: mealError } = await supabase
        .from("meals")
        .insert(mealsToInsert);
      if (mealError) return { error: mealError.message };
    }

    // ── PROGRESS ──
    const { error: progressError } = await supabase.from("progress").insert({
      user_id:                   userId,
      aura_points:               0,
      aura_level:                "Starting",
      current_streak:            0,
      best_streak:               0,
      weekly_completion_percent: 0,
    });

    if (progressError) return { error: progressError.message };

    return { error: null };

  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Unknown error saving plan",
    };
  }
}
