import { supabase } from "./supabase";
import { type GeneratedPlan } from "./planGenerator";

export async function saveUserPlan(
  userId: string,
  generatedPlan: GeneratedPlan
): Promise<{ error: string | null }> {
  const { workoutPlan, mealPlan, nutritionTargets } = generatedPlan;

  try {
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

    if (wpError) return { error: wpError.message };
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
          total_exercises: day.exercises.length,
          estimated_duration: day.is_rest_day ? 0 : day.exercises.length * 8,
        })
        .select("id")
        .single();

      if (wdError) return { error: wdError.message };
      const workoutDayId = wdData.id;

      if (!day.is_rest_day && day.exercises.length > 0) {
        const exerciseRows = day.exercises.map((ex) => ({
          workout_day_id: workoutDayId,
          exercise_name: ex.exercise_name,
          demo_title: ex.demo_title,
          demo_url: null,
          order_index: ex.order_index,
          target_sets: ex.target_sets,
          target_reps: ex.target_reps,
          target_kg: ex.target_kg,
        }));

        const { error: exError } = await supabase
          .from("exercises")
          .insert(exerciseRows);

        if (exError) return { error: exError.message };
      }
    }

    const { data: mpData, error: mpError } = await supabase
      .from("meal_plans")
      .insert({
        user_id: userId,
        plan_name: "My Personalized Meal Plan",
        total_daily_calories: nutritionTargets.targetCalories,
        total_protein: nutritionTargets.protein,
        total_carbs: nutritionTargets.carbs,
        total_fat: nutritionTargets.fat,
        generated_at: new Date().toISOString(),
        expires_at: null,
        is_active: true,
      })
      .select("id")
      .single();

    if (mpError) return { error: mpError.message };
    const mealPlanId = mpData.id;

    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    for (let i = 0; i < mealPlan.days.length; i++) {
      const day = mealPlan.days[i];

      const totalCalories =
        day.breakfast.calories +
        day.lunch.calories +
        day.snack.calories +
        day.dinner.calories;

      const { data: mdData, error: mdError } = await supabase
        .from("meal_days")
        .insert({
          meal_plan_id: mealPlanId,
          day_name: dayNames[i] || `Day ${i + 1}`,
          day_number: i + 1,
          total_calories: totalCalories,
        })
        .select("id")
        .single();

      if (mdError) return { error: mdError.message };
      const mealDayId = mdData.id;

      const mealsToInsert = [day.breakfast, day.lunch, day.snack, day.dinner].map((meal) => ({
        meal_day_id: mealDayId,
        meal_type: meal.meal_type,
        meal_name: meal.meal_name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        cooking_time: meal.cooking_time,
        serving_size: meal.serving_size,
        ingredients: meal.ingredients,
        preparation_steps: meal.preparation_steps,
      }));

      const { error: mealError } = await supabase
        .from("meals")
        .insert(mealsToInsert);

      if (mealError) return { error: mealError.message };
    }

    const { error: progressError } = await supabase
      .from("progress")
      .insert({
        user_id: userId,
        aura_points: 0,
        aura_level: 1,
        current_streak: 0,
        best_streak: 0,
        weekly_completion_percent: 0,
      });

    if (progressError) return { error: progressError.message };

    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Unknown error saving plan" };
  }
}
