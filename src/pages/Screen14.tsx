import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "../components/BottomNav";
import { supabase } from "../lib/supabase";
import { toggleRestDay as toggleRestDayManager } from "../lib/restDayManager";

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const jsDay = new Date().getDay();
const TODAY_INDEX = jsDay === 0 ? 6 : jsDay - 1;

const exerciseGifs: Record<string, string> = {
  "v-bar-pulldown":            "/assets/exercises/v-bar-pulldown.gif",
  "romanian-deadlift":         "/assets/exercises/romanian-deadlift.gif",
  "lat-pull-down":             "/assets/exercises/lat-pull-down.gif",
  "seated-cable-row":          "/assets/exercises/seated-cable-row.gif",
  "single-arm-dumbbell-row":   "/assets/exercises/single-arm-dumbbell-row.gif",
  "rope-face-pulls":           "/assets/exercises/rope-face-pulls.gif",
  "dumbbell-press":            "/assets/exercises/dumbbell-press.gif",
  "military-press":            "/assets/exercises/military-press.gif",
  "lateral-raise":             "/assets/exercises/lateral-raise.gif",
  "rear-delt-fly":             "/assets/exercises/rear-delt-fly.gif",
  "upright-row":               "/assets/exercises/upright-row.gif",
  "dumbell-shrugs":            "/assets/exercises/dumbell-shrugs.gif",
  "barbell-bench-press":       "/assets/exercises/barbell-bench-press.gif",
  "decline-smith-press":       "/assets/exercises/decline-smith-press.gif",
  "cable-fly":                 "/assets/exercises/cable-fly.gif",
  "incline-dumbbell-press":    "/assets/exercises/incline-dumbbell-press.gif",
  "incline-dumbbell-fly":      "/assets/exercises/incline-dumbbell-fly.gif",
  "dumbbell-pullover":         "/assets/exercises/dumbbell-pullover.gif",
  "barbell-curl":              "/assets/exercises/barbell-curl.gif",
  "hammer-curl":               "/assets/exercises/hammer-curl.gif",
  "incline-dumbbell-curl":     "/assets/exercises/incline-dumbbell-curl.gif",
  "concentration-curl":        "/assets/exercises/concentration-curl.gif",
  "barbell-wrist-curl":        "/assets/exercises/barbell-wrist-curl.gif",
  "reverse-barbell-curl":      "/assets/exercises/reverse-barbell-curl.gif",
  "skull-crushers":            "/assets/exercises/skull-crushers.gif",
  "seated-barbell-extension":  "/assets/exercises/seated-barbell-extension.gif",
  "one-arm-extension":         "/assets/exercises/one-arm-extension.gif",
  "straight-grip-pushdown":    "/assets/exercises/straight-grip-pushdown.gif",
  "seated-dumbbell-extension": "/assets/exercises/seated-dumbbell-extension.gif",
  "kickbacks":                 "/assets/exercises/kickbacks.gif",
  "barbell-squat":             "/assets/exercises/barbell-squat.gif",
  "leg-press":                 "/assets/exercises/leg-press.gif",
  "leg-curl":                  "/assets/exercises/leg-curl.gif",
  "calf-raise":                "/assets/exercises/calf-raise.gif",
  "hanging-leg-raise":         "/assets/exercises/hanging-leg-raise.gif",
  "cable-crunch":              "/assets/exercises/cable-crunch.gif",
};

function getMealOrder(workoutTime: string | null): string[] {
  switch (workoutTime) {
    case "morning":   return ["pre_workout", "breakfast", "lunch", "snack", "dinner"];
    case "afternoon": return ["breakfast", "lunch", "pre_workout", "snack", "dinner"];
    case "evening":   return ["breakfast", "lunch", "snack", "pre_workout", "dinner"];
    default:          return ["breakfast", "lunch", "pre_workout", "snack", "dinner"];
  }
}

interface ExerciseRow {
  id: string;
  exercise_name: string;
  demo_title: string;
  demo_gif: string;
  target_sets: number;
  target_reps: string;
  target_kg: number;
  order_index: number;
  sets: { kg: number; reps: number; done: boolean }[];
  showVideo: boolean;
}

interface WorkoutDay {
  id: string;
  day_name: string;
  day_number: number;
  muscle_group: string;
  is_rest_day: boolean;
  total_exercises: number;
  estimated_duration: string;
  exercises: ExerciseRow[];
}

interface MealItem {
  id: string;
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
  completed: boolean;
  saved: boolean;
  expanded: boolean;
}

interface MealDay {
  id: string;
  day_name: string;
  day_number: number;
  total_calories: number;
  meals: MealItem[];
}

// ── Save a single set to Supabase ──
async function saveSetToDb(userId: string, exerciseId: string, setIndex: number, kg: number, reps: number, done: boolean) {
  const todayDate = new Date().toISOString().split("T")[0];
  await supabase.from("workout_logs").upsert({
    user_id: userId,
    exercise_id: exerciseId,
    date: todayDate,
    set_index: setIndex,
    kg,
    reps,
    done,
  }, { onConflict: "user_id,exercise_id,date,set_index" });
}

// ── Exercise Card ──
function ExerciseCard({
  exercise, onToggleVideo, onToggleDone, onChangeKg, onChangeReps, onAddSet, onRemoveSet,
}: {
  exercise: ExerciseRow;
  onToggleVideo: () => void;
  onToggleDone: (i: number) => void;
  onChangeKg: (i: number, v: number) => void;
  onChangeReps: (i: number, v: number) => void;
  onAddSet: () => void;
  onRemoveSet: () => void;
}) {
  const gifUrl = exerciseGifs[exercise.exercise_name] || "";

  return (
    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <p className="text-purple-600 font-bold text-sm flex-1 pr-2">{exercise.exercise_name}</p>
      </div>

      {/* Hint for editing weight */}
      <p className="text-gray-400 text-xs mb-3">✏️ Tap KG or REPS to type your own value</p>

      <button
        onClick={onToggleVideo}
        className="w-full rounded-xl py-2.5 px-4 mb-3 flex items-center gap-2"
        style={{ border: "1.5px dashed #a78bfa" }}
      >
        <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
        </svg>
        <span className="text-purple-600 font-bold text-xs">Watch Demo</span>
        <span className="text-gray-400 text-xs ml-1">({exercise.exercise_name})</span>
      </button>

      {exercise.showVideo && (
        <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
          <div className="bg-black w-full flex items-center justify-center" style={{ minHeight: 180 }}>
            {gifUrl ? (
              <img
                src={gifUrl}
                alt={exercise.exercise_name}
                className="w-full object-contain"
                style={{ maxHeight: 220 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 py-8">
                <span className="text-white text-sm opacity-60">{exercise.exercise_name}</span>
                <span className="text-gray-500 text-xs">Demo coming soon</span>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Demo: <span className="text-purple-600 font-medium">{exercise.exercise_name}</span>
            </span>
            <button onClick={onToggleVideo} className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs font-bold">✕</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-1 mb-2">
        {["SET", "TARGET", "KG", "REPS", ""].map((h) => (
          <span key={h} className="text-gray-400 text-xs font-medium text-center">{h}</span>
        ))}
      </div>

      {exercise.sets.map((s, si) => (
        <div key={si} className="grid grid-cols-5 gap-1 items-center mb-2">
          <span className="text-center font-bold text-gray-800 text-sm">{si + 1}</span>
          <span className="text-center text-gray-400 text-xs">{exercise.target_reps}</span>
          <input
            type="number"
            value={s.kg === 0 ? "" : s.kg}
            placeholder="2.5"
            onChange={(e) => onChangeKg(si, parseFloat(e.target.value) || 0)}
            className="bg-gray-100 rounded-lg py-1.5 text-center text-gray-700 text-sm font-medium w-full border-none outline-none"
          />
          <input
            type="number"
            value={s.reps === 0 ? "" : s.reps}
            placeholder="10"
            onChange={(e) => onChangeReps(si, parseInt(e.target.value) || 1)}
            className="bg-gray-100 rounded-lg py-1.5 text-center text-gray-700 text-sm font-medium w-full border-none outline-none"
          />
          <button
            onClick={() => onToggleDone(si)}
            className={`w-7 h-7 mx-auto rounded-full border-2 flex items-center justify-center transition-colors ${s.done ? "border-green-500 bg-green-500" : "border-gray-300"}`}
          >
            {s.done && (
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </div>
      ))}

      <div className="flex justify-around mt-3 pt-3 border-t border-gray-100">
        <button onClick={onAddSet} className="text-purple-500 text-xs font-bold">+ ADD SET</button>
        <button onClick={onRemoveSet} className="text-gray-400 text-xs font-bold">— REMOVE</button>
      </div>
    </div>
  );
}

// ── Meal Card ──
function MealCard({
  meal, onToggle, onToggleComplete, onToggleSaved,
}: {
  meal: MealItem;
  onToggle: () => void;
  onToggleComplete: () => void;
  onToggleSaved: () => void;
}) {
  const mealIcons: Record<string, string> = {
    breakfast: "🍳", lunch: "🍗", snack: "🥜", pre_workout: "⚡", dinner: "🍽️",
  };
  const mealLabels: Record<string, string> = {
    breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", pre_workout: "Pre-Workout", dinner: "Dinner",
  };

  return (
    <div className="bg-yellow-50 rounded-2xl mb-3 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
          {mealIcons[meal.meal_type] || "🍽️"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{mealLabels[meal.meal_type] || meal.meal_type}</p>
          <p className="text-gray-600 text-xs truncate">{meal.meal_name}</p>
          <p className="text-gray-400 text-xs">{meal.calories} kcal | P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</p>
        </div>
        <button
          onClick={onToggleComplete}
          className={`flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-bold flex items-center gap-1 transition-colors ${meal.completed ? "bg-gray-300 text-gray-600" : "bg-green-500 text-white"}`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {meal.completed ? "Done" : "Complete"}
        </button>
        <button onClick={onToggle} className="text-gray-500 flex-shrink-0 ml-1">
          <svg className={`w-4 h-4 transition-transform ${meal.expanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {meal.expanded && (
        <div className="px-4 pb-4">
          <p className="font-bold text-gray-900 text-base mb-3">{meal.meal_name}</p>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { val: String(meal.calories), label: "Calories" },
              { val: `${meal.protein}g`, label: "Protein" },
              { val: `${meal.carbs}g`, label: "Carbs" },
              { val: `${meal.fat}g`, label: "Fat" },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-xl p-2 text-center">
                <p className="font-bold text-xl text-green-600 leading-tight">{m.val}</p>
                <p className="text-gray-400 text-xs">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs">Cooking Time</p>
              <p className="font-bold text-gray-800 text-sm">{meal.cooking_time}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs">Serving Size</p>
              <p className="font-bold text-gray-800 text-sm">{meal.serving_size}</p>
            </div>
          </div>

          <p className="font-bold text-gray-900 text-sm mb-2">Ingredients</p>
          {meal.ingredients.map((ing, i) => (
            <p key={i} className="text-gray-700 text-sm mb-0.5">• {ing}</p>
          ))}

          <p className="font-bold text-gray-900 text-sm mt-4 mb-2">How to Prepare</p>
          {meal.preparation_steps.map((step, i) => (
            <p key={i} className="text-gray-700 text-sm mb-3 leading-relaxed">{i + 1}. {step}</p>
          ))}

          {meal.meal_type === "lunch" && (
            <div className="bg-blue-50 rounded-xl p-3 mt-2 mb-2">
              <p className="text-blue-700 text-xs font-medium">
                💡 Cook double — eat half now, reheat half for dinner.
              </p>
            </div>
          )}

          {meal.meal_type === "dinner" && (
            <div className="bg-orange-50 rounded-xl p-3 mt-2 mb-2">
              <p className="text-orange-600 text-xs font-medium">
                ♻️ Already cooked at lunch — just reheat. 5 minutes.
              </p>
            </div>
          )}

          <button
            onClick={onToggleSaved}
            className={`w-full mt-2 border-2 font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors ${meal.saved ? "border-red-500 bg-red-50 text-red-600" : "border-red-400 text-red-500"}`}
          >
            <svg className={`w-4 h-4 ${meal.saved ? "fill-current" : ""}`} viewBox="0 0 24 24" fill={meal.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {meal.saved ? "Saved" : "Save Recipe"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Screen ──
export default function Screen14() {
  const [activeTab, setActiveTab] = useState<"workouts" | "meals">("workouts");
  const [selectedDayIndex, setSelectedDayIndex] = useState(TODAY_INDEX);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [mealDays, setMealDays] = useState<MealDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [switchingRestDay, setSwitchingRestDay] = useState(false);
  const [userName, setUserName] = useState("");
  const [restDay, setRestDay] = useState<"sunday" | "friday">("sunday");
  const [userGoal, setUserGoal] = useState("maintain");
  const [userId, setUserId] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "meals") setActiveTab("meals");
  }, []);

  useEffect(() => {
    loadPlanData();
  }, []);

  async function loadPlanData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, rest_day, primary_goal")
        .eq("id", user.id)
        .single();

      if (profile?.name) setUserName(profile.name.split(" ")[0]);
      if (profile?.rest_day) setRestDay(profile.rest_day as "sunday" | "friday");
      if (profile?.primary_goal) setUserGoal(profile.primary_goal);

      const { data: wp } = await supabase
        .from("workout_plans")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (wp) {
        const { data: wDays } = await supabase
          .from("workout_days")
          .select("id, day_name, day_number, muscle_group, is_rest_day, total_exercises, estimated_duration")
          .eq("workout_plan_id", wp.id)
          .order("day_number", { ascending: true });

        if (wDays) {
          const todayDate = new Date().toISOString().split("T")[0];

          const daysWithExercises: WorkoutDay[] = await Promise.all(
            wDays.map(async (day) => {
              if (day.is_rest_day) return { ...day, exercises: [] };

              const { data: exs } = await supabase
                .from("exercises")
                .select("id, exercise_name, demo_title, target_sets, target_reps, target_kg, order_index")
                .eq("workout_day_id", day.id)
                .order("order_index", { ascending: true });

              const exIds = (exs || []).map((e) => e.id);

              const { data: wLogs } = await supabase
                .from("workout_logs")
                .select("exercise_id, set_index, kg, reps, done")
                .eq("user_id", user.id)
                .eq("date", todayDate)
                .in("exercise_id", exIds);

              const exercises: ExerciseRow[] = (exs || []).map((ex) => ({
                ...ex,
                demo_gif: exerciseGifs[ex.exercise_name] || "",
                sets: Array(ex.target_sets).fill(null).map((_, si) => {
                  const log = (wLogs || []).find(
                    (l) => l.exercise_id === ex.id && l.set_index === si
                  );
                  return {
                    kg: log?.kg ?? 2.5,
                    reps: log?.reps ?? parseInt(ex.target_reps?.split("-")[0] || "10"),
                    done: log?.done ?? false,
                  };
                }),
                showVideo: false,
              }));

              return { ...day, exercises };
            })
          );
          setWorkoutDays(daysWithExercises);
        }
      }

      const { data: mp } = await supabase
        .from("meal_plans")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (mp) {
        const { data: mDays } = await supabase
          .from("meal_days")
          .select("id, day_name, day_number, total_calories")
          .eq("meal_plan_id", mp.id)
          .order("day_number", { ascending: true });

        if (mDays) {
          const todayDate = new Date().toISOString().split("T")[0];
          const { data: mealLogs } = await supabase
            .from("meal_logs")
            .select("meal_id, completed")
            .eq("user_id", user.id)
            .eq("date", todayDate);

          const completedMealIds = new Set(
            (mealLogs || []).filter((l) => l.completed).map((l) => l.meal_id)
          );

          const workoutTime = localStorage.getItem("onboarding_preferred_workout_time");
          const mealOrder = getMealOrder(workoutTime);

          const daysWithMeals: MealDay[] = await Promise.all(
            mDays.map(async (day) => {
              const { data: meals } = await supabase
                .from("meals")
                .select("id, meal_type, meal_name, calories, protein, carbs, fat, cooking_time, serving_size, ingredients, preparation_steps")
                .eq("meal_day_id", day.id);

              const sortedMeals = (meals || []).sort((a, b) => {
                const aPos = mealOrder.indexOf(a.meal_type);
                const bPos = mealOrder.indexOf(b.meal_type);
                return (aPos === -1 ? 99 : aPos) - (bPos === -1 ? 99 : bPos);
              });

              const mealItems: MealItem[] = sortedMeals.map((m) => ({
                ...m,
                completed: completedMealIds.has(m.id),
                saved: false,
                expanded: false,
              }));

              return { ...day, meals: mealItems };
            })
          );
          setMealDays(daysWithMeals);
        }
      }
    } catch (err) {
      console.error("Plan load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRestDay() {
    setSwitchingRestDay(true);
    try {
      const { newRestDay, error } = await toggleRestDayManager(restDay, userGoal);
      if (error) {
        console.error("Rest day toggle error:", error);
        return;
      }
      setRestDay(newRestDay);
      await loadPlanData();
    } finally {
      setSwitchingRestDay(false);
    }
  }

  const currentWorkoutDay = workoutDays.find((d) => d.day_name === DAYS_FULL[selectedDayIndex]);
  const currentMealDay = mealDays.find((d) => d.day_name === DAYS_FULL[selectedDayIndex]);

  // ── Directly compute updated set and save to DB without relying on stale state ──
  function updateExerciseAndSave(
    exIdx: number,
    updater: (ex: ExerciseRow) => ExerciseRow,
    saveSetIndex?: number
  ) {
    setWorkoutDays((prev) => {
      const next = prev.map((day) => {
        if (day.day_name !== DAYS_FULL[selectedDayIndex]) return day;
        const exs = [...day.exercises];
        exs[exIdx] = updater({ ...exs[exIdx], sets: [...exs[exIdx].sets] });

        // Save to DB inside the updater so we have the fresh value
        if (saveSetIndex !== undefined && userId) {
          const ex = exs[exIdx];
          const s = ex.sets[saveSetIndex];
          saveSetToDb(userId, ex.id, saveSetIndex, s.kg, s.reps, s.done);
        }

        return { ...day, exercises: exs };
      });
      return next;
    });
  }

  async function toggleMealComplete(mealId: string, currentlyDone: boolean) {
    setMealDays((prev) =>
      prev.map((day) => ({
        ...day,
        meals: day.meals.map((m) =>
          m.id === mealId ? { ...m, completed: !currentlyDone } : m
        ),
      }))
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const todayDate = new Date().toISOString().split("T")[0];

    if (!currentlyDone) {
      const { error: upsertError } = await supabase
        .from("meal_logs")
        .upsert({
          user_id: user.id,
          meal_id: mealId,
          date: todayDate,
          completed: true,
          saved_recipe: false,
        }, { onConflict: "user_id,meal_id,date" });

      if (upsertError) {
        console.error("Meal log save failed:", upsertError.message);
      }
    } else {
      await supabase
        .from("meal_logs")
        .update({ completed: false })
        .eq("user_id", user.id)
        .eq("meal_id", mealId)
        .eq("date", todayDate);
    }
  }

  function toggleMealExpand(mealId: string) {
    setMealDays((prev) =>
      prev.map((day) => ({
        ...day,
        meals: day.meals.map((m) =>
          m.id === mealId ? { ...m, expanded: !m.expanded } : m
        ),
      }))
    );
  }

  function toggleMealSaved(mealId: string) {
    setMealDays((prev) =>
      prev.map((day) => ({
        ...day,
        meals: day.meals.map((m) =>
          m.id === mealId ? { ...m, saved: !m.saved } : m
        ),
      }))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (switchingRestDay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-sm">Switching rest day...</p>
          <p className="text-gray-400 text-xs mt-1">Rebuilding your workout plan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm h-screen bg-white flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20">

          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/goku_main.png" alt="Goku" style={{ width: 52, height: "auto", objectFit: "contain" }} />
              <div>
                <p className="text-gray-700 text-sm">Hey {userName || "there"}! 👋</p>
                <p className="font-bold text-gray-900 text-base">Here's your custom plan</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center mb-5">
              {(["workouts", "meals"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-9 py-2.5 rounded-full text-sm font-bold border-2 transition-colors capitalize ${activeTab === tab ? "border-green-500 text-green-600 bg-green-50" : "border-gray-300 text-gray-500 bg-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-1 px-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-lg truncate">
                  {DAYS_FULL[selectedDayIndex]}
                  {activeTab === "workouts" && currentWorkoutDay && !currentWorkoutDay.is_rest_day && (
                    <span className="text-gray-500 font-normal text-sm ml-2">
                      — {currentWorkoutDay.muscle_group}
                    </span>
                  )}
                </p>
                {selectedDayIndex === TODAY_INDEX && (
                  <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                    Today
                  </span>
                )}
              </div>

              {activeTab === "workouts" && (
                <button
                  onClick={handleToggleRestDay}
                  className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1.5 rounded-xl transition-colors flex-shrink-0 ml-2"
                >
                  <span>😴</span>
                  <span>{restDay === "sunday" ? "Rest: Sun→Fri" : "Rest: Fri→Sun"}</span>
                </button>
              )}
            </div>

            {activeTab === "workouts" && (
              <p className="text-gray-400 text-xs px-1 mb-2">
                Rest day: <span className="font-semibold text-gray-500">{restDay === "sunday" ? "Sunday" : "Friday"}</span>
              </p>
            )}

            <p className="text-gray-400 text-xs text-center mb-2">View other days:</p>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
              {DAYS_SHORT.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setSelectedDayIndex(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedDayIndex === i ? "bg-purple-500 text-white border-purple-500" : i === TODAY_INDEX ? "bg-purple-100 text-purple-600 border-purple-300" : "bg-white text-gray-600 border-gray-300"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">

            {/* WORKOUTS TAB */}
            {activeTab === "workouts" && (
              <>
                {!currentWorkoutDay ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">No workout data found</p>
                  </div>
                ) : currentWorkoutDay.is_rest_day ? (
                  <div className="text-center py-10">
                    <p className="text-4xl mb-3">😴</p>
                    <p className="font-bold text-gray-700 text-lg">Rest Day</p>
                    <p className="text-gray-400 text-sm mt-1">Recovery is part of the plan</p>
                    <button
                      onClick={handleToggleRestDay}
                      className="mt-4 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-colors mx-auto"
                    >
                      <span>🔄</span>
                      <span>
                        {restDay === "sunday" ? "Switch rest day to Friday" : "Switch rest day to Sunday"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 font-semibold text-sm text-center mb-1">
                      {currentWorkoutDay.muscle_group} — {currentWorkoutDay.exercises.length} exercises
                    </p>
                    <p className="text-gray-400 text-xs text-center mb-4">
                      {currentWorkoutDay.estimated_duration}
                    </p>
                    {currentWorkoutDay.exercises.map((ex, exIdx) => (
                      <ExerciseCard
                        key={ex.id}
                        exercise={ex}
                        onToggleVideo={() => updateExerciseAndSave(exIdx, (e) => ({ ...e, showVideo: !e.showVideo }))}
                        onToggleDone={(si) => updateExerciseAndSave(exIdx, (e) => ({
                          ...e,
                          sets: e.sets.map((s, i) => i === si ? { ...s, done: !s.done } : s),
                        }), si)}
                        onChangeKg={(si, v) => updateExerciseAndSave(exIdx, (e) => ({
                          ...e,
                          sets: e.sets.map((s, i) => i === si ? { ...s, kg: Math.max(0, v) } : s),
                        }), si)}
                        onChangeReps={(si, v) => updateExerciseAndSave(exIdx, (e) => ({
                          ...e,
                          sets: e.sets.map((s, i) => i === si ? { ...s, reps: Math.max(1, v) } : s),
                        }), si)}
                        onAddSet={() => updateExerciseAndSave(exIdx, (e) => ({
                          ...e,
                          sets: [...e.sets, { kg: 2.5, reps: parseInt(e.target_reps?.split("-")[0] || "10"), done: false }],
                        }))}
                        onRemoveSet={() => updateExerciseAndSave(exIdx, (e) => ({
                          ...e,
                          sets: e.sets.length > 1 ? e.sets.slice(0, -1) : e.sets,
                        }))}
                      />
                    ))}
                  </>
                )}
              </>
            )}

            {/* MEALS TAB */}
            {activeTab === "meals" && (
              <>
                {!currentMealDay ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">No meals found for this day</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 font-semibold text-sm text-center mb-1">
                      {currentMealDay.total_calories} kcal planned
                    </p>
                    <p className="text-gray-400 text-xs text-center mb-4">
                      {currentMealDay.meals.filter((m) => m.completed).length} of {currentMealDay.meals.length} meals completed
                    </p>
                    {currentMealDay.meals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        onToggle={() => toggleMealExpand(meal.id)}
                        onToggleComplete={() => toggleMealComplete(meal.id, meal.completed)}
                        onToggleSaved={() => toggleMealSaved(meal.id)}
                      />
                    ))}
                  </>
                )}
              </>
            )}

          </div>
        </div>
        <BottomNav active="plan" />
      </div>
    </div>
  );
}
