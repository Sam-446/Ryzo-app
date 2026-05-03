import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNav from "../components/BottomNav";
import { supabase } from "../lib/supabase";

interface NutritionTargets {
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

interface TodayWorkout {
  muscle_group: string;
  estimated_duration: string;
  is_rest_day: boolean;
  total_exercises: number;
}

interface TodayMeal {
  meal_name: string;
  calories: number;
  meal_type: string;
}

type MealPlanRow = {
  id: string;
  target_daily_calories: number | null;
  target_protein: number | null;
  target_carbs: number | null;
  target_fat: number | null;
  total_daily_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
};

const suggestions = [
  "Why am I not gaining weight?",
  "How do I cut belly fat?",
  "How can I increase strength?",
  "Is creatine safe?"
];

export default function Screen12() {
  const [, navigate] = useLocation();

  const [userName, setUserName] = useState("there");
  const [nutrition, setNutrition] = useState<NutritionTargets | null>(null);
  const [mealTotals, setMealTotals] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout | null>(null);
  const [todayFirstMeal, setTodayFirstMeal] = useState<TodayMeal | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [macrosConsumed, setMacrosConsumed] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [water, setWater] = useState(0);
  const [waterGoal] = useState(3000);
  const [loading, setLoading] = useState(true);

  const [coachInput, setCoachInput] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [typedSuggestion, setTypedSuggestion] = useState("");

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[today.getDay()];
  const dateStr = today.toLocaleDateString("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadDashboardData();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const handleFocus = () => loadDashboardData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    let index = 0;
    const text = suggestions[currentSuggestion];
    setTypedSuggestion("");

    const interval = setInterval(() => {
      setTypedSuggestion(text.slice(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
        }, 1500);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [currentSuggestion]);

  const handleCoachSend = () => {
    if (!coachInput.trim()) return;
    navigate(`/coach-glow?question=${encodeURIComponent(coachInput.trim())}`);
  };

  async function loadDashboardData() {
    try {
      setLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.name) setUserName(profile.name.split(" ")[0]);

      const { data: activeMealPlan } = await supabase
        .from("meal_plans")
        .select("id, target_daily_calories, target_protein, target_carbs, target_fat, total_daily_calories, total_protein, total_carbs, total_fat")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle<MealPlanRow>();

      if (activeMealPlan) {
        const targetCals =
          activeMealPlan.total_daily_calories ||
          activeMealPlan.target_daily_calories ||
          0;

        setNutrition({
          targetCalories: targetCals,
          proteinGrams: activeMealPlan.total_protein,
          carbsGrams: activeMealPlan.total_carbs,
          fatGrams: activeMealPlan.total_fat,
        });

        setMealTotals({
          protein: activeMealPlan.total_protein,
          carbs: activeMealPlan.total_carbs,
          fat: activeMealPlan.total_fat,
        });
      } else {
        setNutrition({ targetCalories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 });
        setMealTotals({ protein: 0, carbs: 0, fat: 0 });
      }

      const { data: workoutPlan } = await supabase
        .from("workout_plans")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (workoutPlan?.id) {
        const { data: workoutDay } = await supabase
          .from("workout_days")
          .select("muscle_group, estimated_duration, is_rest_day, total_exercises")
          .eq("workout_plan_id", workoutPlan.id)
          .eq("day_name", todayName)
          .maybeSingle();
        if (workoutDay) setTodayWorkout(workoutDay as TodayWorkout);
      } else {
        setTodayWorkout(null);
      }

      if (activeMealPlan?.id) {
        const { data: mealDay } = await supabase
          .from("meal_days")
          .select("id")
          .eq("meal_plan_id", activeMealPlan.id)
          .eq("day_name", todayName)
          .maybeSingle();

        if (mealDay?.id) {
          const { data: firstMeal } = await supabase
            .from("meals")
            .select("meal_name, calories, meal_type")
            .eq("meal_day_id", mealDay.id)
            .eq("meal_type", "breakfast")
            .maybeSingle();
          if (firstMeal) setTodayFirstMeal(firstMeal as TodayMeal);
          else setTodayFirstMeal(null);
        } else {
          setTodayFirstMeal(null);
        }
      } else {
        setTodayFirstMeal(null);
      }

      const todayDate = today.toISOString().split("T")[0];

      const { data: mealLogs } = await supabase
        .from("meal_logs")
        .select("meal_id")
        .eq("user_id", user.id)
        .eq("date", todayDate)
        .eq("completed", true);

      if (mealLogs && mealLogs.length > 0) {
        const mealIds = mealLogs.map((log) => log.meal_id);
        const { data: completedMeals } = await supabase
          .from("meals")
          .select("calories, protein, carbs, fat")
          .in("id", mealIds);

        if (completedMeals) {
          const totals = completedMeals.reduce(
            (acc, meal: any) => ({
              calories: acc.calories + (meal.calories || 0),
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fat: acc.fat + (meal.fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );
          setCaloriesConsumed(totals.calories);
          setMacrosConsumed({ protein: totals.protein, carbs: totals.carbs, fat: totals.fat });
        }
      } else {
        setCaloriesConsumed(0);
        setMacrosConsumed({ protein: 0, carbs: 0, fat: 0 });
      }

      const todayDate2 = today.toISOString().split("T")[0];
      const { data: hydrationLog } = await supabase
        .from("hydration_logs")
        .select("amount_ml, daily_goal_ml")
        .eq("user_id", user.id)
        .eq("date", todayDate2)
        .maybeSingle();

      if (hydrationLog) setWater(hydrationLog.amount_ml || 0);

    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addWater(ml: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const todayDate = new Date().toISOString().split("T")[0];
      const newTotal = water + ml;

      const { error } = await supabase
        .from("hydration_logs")
        .upsert(
          { user_id: user.id, date: todayDate, amount_ml: newTotal, daily_goal_ml: waterGoal },
          { onConflict: "user_id,date" }
        );

      if (!error) setWater(newTotal);
    } catch (err) {
      console.error("Hydration error:", err);
    }
  }

  const caloriesRemaining = nutrition ? nutrition.targetCalories - caloriesConsumed : 0;
  const caloriesDisplay = Math.abs(caloriesRemaining);
  const isOver = caloriesRemaining < 0;

  const macroItems = [
    { key: "protein", label: "Protein", icon: "🥩", consumed: macrosConsumed.protein, target: mealTotals.protein, unit: "g" },
    { key: "carbs", label: "Carbs", icon: "🍚", consumed: macrosConsumed.carbs, target: mealTotals.carbs, unit: "g" },
    { key: "fat", label: "Fat", icon: "🥑", consumed: macrosConsumed.fat, target: mealTotals.fat, unit: "g" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="w-full max-w-sm mx-auto min-h-screen bg-[#f5f0eb] flex flex-col pb-28">

        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <img
              src="/assets/goku_main.png"
              alt="Goku"
              style={{ width: 76, height: "auto", objectFit: "contain", flexShrink: 0 }}
            />
            <div className="flex-1">
              <p className="text-xs text-gray-400 text-right">{dateStr}</p>
              <p className="text-gray-900 text-base font-medium mt-1">
                {greeting}, {userName}!<br />
                your glow is <span className="text-orange-500 font-bold">rising 🔥</span>
              </p>
            </div>
          </div>
        </div>

        {/* Calories */}
        <div
          className="mx-4 rounded-3xl p-6 mb-4"
          style={{ background: "linear-gradient(135deg, #c9900e, #e5a820)" }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-sm font-medium">
              {isOver ? "Calories over" : "Calories left"}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full border-4 border-white/30 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white">{caloriesDisplay}</span>
              <span className="text-white/80 text-xs">{isOver ? "over" : "left"}</span>
              <span className="text-white/60 text-xs">
                {caloriesConsumed} / {nutrition?.targetCalories || 0} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="mx-4 bg-white rounded-2xl p-4 mb-4">
          <p className="text-gray-900 font-bold text-base mb-4">Today's Macros</p>
          {macroItems.map((m) => {
            const pct = m.target > 0 ? Math.min((m.consumed / m.target) * 100, 100) : 0;
            return (
              <div key={m.key} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-gray-800 text-sm font-medium">{m.label}</span>
                  </div>
                  <span className="text-gray-800 text-sm">
                    {m.consumed}{m.unit} / {m.target}{m.unit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Workout + Meals */}
        <div className="mx-4 grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => navigate("/plan")}
            className="bg-green-600 rounded-2xl p-4 text-white text-left"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl mb-3">💪</div>
            <p className="text-green-200 text-xs">Today's Workout</p>
            <p className="font-bold text-base leading-tight">
              {todayWorkout?.is_rest_day ? "Rest Day" : todayWorkout?.muscle_group || "Workout"}
            </p>
            <p className="text-green-200 text-xs mt-1">
              {todayWorkout?.is_rest_day ? "Recovery day" : `${todayWorkout?.total_exercises || 6} exercises`}
            </p>
          </button>

          <button
            onClick={() => navigate("/plan?tab=meals")}
            className="rounded-2xl p-4 text-white text-left"
            style={{ background: "#b5760c" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3"
              style={{ background: "#c9900e" }}
            >🍽️</div>
            <p className="text-yellow-200 text-xs">Today's Meals</p>
            <p className="font-bold text-base leading-tight">
              {todayFirstMeal?.meal_name || "View Plan"}
            </p>
            <p className="text-yellow-200 text-xs mt-1">
              {todayFirstMeal ? `${todayFirstMeal.calories} kcal` : "Tap to view"}
            </p>
          </button>
        </div>

        {/* Steps + Hydration */}
        <div className="mx-4 grid grid-cols-2 gap-3 mb-4">

          <button
            onClick={() => navigate("/steps")}
            className="bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[150px] text-left"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-2">
              👟
            </div>
            <div>
              <p className="text-gray-500 text-xs">Track Daily</p>
              <p className="font-bold text-gray-900">Steps</p>
              <p className="text-xs text-blue-500 mt-1 font-semibold">
                Connect & earn Aura points
              </p>
            </div>
          </button>

          <div className="bg-blue-500 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">Hydration</span>
              <span className="text-lg">💧</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold">{water}</span>
              <span className="text-white/70 text-xs">/ {waterGoal}ml</span>
            </div>
            <div className="w-full h-1.5 bg-blue-400 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${Math.min((water / waterGoal) * 100, 100)}%` }}
              />
            </div>
            <div className="flex gap-1 mb-1">
              {[250, 500].map((ml) => (
                <button
                  key={ml}
                  onClick={() => addWater(ml)}
                  className="flex-1 bg-white text-blue-600 rounded-full py-1.5 text-xs font-semibold"
                >
                  +{ml}ml
                </button>
              ))}
            </div>
            <button
              onClick={() => addWater(750)}
              className="w-full bg-blue-400 rounded-full py-1.5 text-xs font-semibold"
            >
              +750ml
            </button>
          </div>
        </div>

        {/* Coach Ryzo Integrated */}
        <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#f5e6d3" }}>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/assets/goku1.png"
              alt="Goku"
              style={{ width: 84, height: "auto", objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <span className="font-bold text-gray-900 text-base">Coach Ryzo</span>
              <p className="text-xs text-gray-500 mt-0.5">
                AI coaching — Ask anything about gym, food, progress
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-400 mb-3 h-4">
            {typedSuggestion}
          </div>

          <div className="flex gap-2">
            <input
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 rounded-full px-4 py-2 text-xs border border-gray-300 outline-none bg-white"
            />
            <button
              onClick={handleCoachSend}
              className="bg-black text-white rounded-full px-4 py-2 text-xs font-semibold"
            >
              Send
            </button>
          </div>
        </div>

        <BottomNav active="home" />
      </div>
    </div>
  );
}
