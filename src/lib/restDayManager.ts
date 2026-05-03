import { supabase } from "./supabase";
import { workoutTemplates, workoutTemplatesFridayRest } from "../data/templates/workoutTemplates";
import type { WorkoutDayTemplate } from "../data/templates/workoutTemplates";

async function deleteExistingWorkoutPlan(userId: string): Promise<void> {
  const { data: existingPlan } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (!existingPlan) return;

  const { data: workoutDays } = await supabase
    .from("workout_days")
    .select("id")
    .eq("workout_plan_id", existingPlan.id);

  if (workoutDays && workoutDays.length > 0) {
    const dayIds = workoutDays.map((d) => d.id);

    await supabase
      .from("exercises")
      .delete()
      .in("workout_day_id", dayIds);

    await supabase
      .from("workout_days")
      .delete()
      .eq("workout_plan_id", existingPlan.id);
  }

  await supabase
    .from("workout_plans")
    .delete()
    .eq("id", existingPlan.id);
}

async function saveNewWorkoutPlan(
  userId: string,
  days: WorkoutDayTemplate[]
): Promise<{ error: string | null }> {
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

    for (const day of days) {
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

    return { error: null };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function toggleRestDay(
  currentRestDay: "sunday" | "friday",
  userGoal: string
): Promise<{ newRestDay: "sunday" | "friday"; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { newRestDay: currentRestDay, error: "Not logged in" };

    const newRestDay = currentRestDay === "sunday" ? "friday" : "sunday";
    const goalKey = userGoal || "maintain";

    const newDays = newRestDay === "friday"
      ? (workoutTemplatesFridayRest[goalKey] || workoutTemplatesFridayRest["maintain"])
      : (workoutTemplates[goalKey] || workoutTemplates["maintain"]);

    await deleteExistingWorkoutPlan(user.id);

    const { error: saveError } = await saveNewWorkoutPlan(user.id, newDays);
    if (saveError) return { newRestDay: currentRestDay, error: saveError };

    await supabase
      .from("profiles")
      .update({ rest_day: newRestDay })
      .eq("id", user.id);

    return { newRestDay, error: null };

  } catch (err: unknown) {
    return {
      newRestDay: currentRestDay,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}
