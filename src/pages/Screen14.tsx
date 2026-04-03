import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { workoutPlan } from "../data/workoutPlan";
import { mealPlan } from "../data/mealPlan";
import { history } from "../data/history";
const save = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));
const load = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ── Workout data ── */
interface SetRow { kg: number; reps: number; done: boolean; }
interface Exercise { name: string; demo: string; sets: SetRow[]; showVideo: boolean; }
interface DayWorkout { type: string; count: number; exercises: Exercise[]; }

function makeSet(kg: number, reps: number): SetRow { return { kg, reps, done: false }; }

// Transform workout data from mock data format to component format
const transformWorkoutData = (): Record<number, DayWorkout> => {
  const result: Record<number, DayWorkout> = {};
  workoutPlan.week.forEach((day) => {
    result[day.dayIndex] = {
      type: day.title,
      count: day.exerciseCount,
      exercises: day.exercises.map((ex) => ({
        name: ex.name,
        demo: ex.demoTitle,
        sets: ex.sets.map((s) => ({ ...s, done: false })),
        showVideo: false,
      })),
    };
  });
  return result;
};

const WORKOUT_DATA = transformWorkoutData();

/* ── Meal data ── */
interface MealItem {
  id: string; icon: string; type: string;
  name: string; fullName: string;
  kcal: number; protein: number; carbs: number; fat: number;
  cookTime: string; serving: string; completed: boolean;
  ingredients: string[]; steps: string[];
}
interface DayMeals { kcal: number; items: MealItem[]; }

// Transform meal data from mock data format to component format
const transformMealData = (): Record<number, DayMeals> => {
  const result: Record<number, DayMeals> = {};
  mealPlan.week.forEach((day) => {
    result[day.dayIndex] = {
      kcal: day.totalKcal,
      items: day.meals,
    };
  });
  return result;
};

const MEAL_DATA = transformMealData();

/* ── Exercise card ── */
function ExerciseCard({
  exercise, exIdx, dayIdx,
  onToggleVideo, onToggleDone, onChangeKg, onChangeReps, onAddSet, onRemoveSet,
}: {
  exercise: Exercise; exIdx: number; dayIdx: number;
  onToggleVideo: () => void;
  onToggleDone: (s: number) => void;
  onChangeKg: (s: number, v: number) => void;
  onChangeReps: (s: number, v: number) => void;
  onAddSet: () => void;
  onRemoveSet: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-purple-600 font-bold text-sm flex-1 pr-2">{exercise.name}</p>
        <button className="text-gray-400 mt-0.5">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Watch Demo button */}
      <button
        onClick={onToggleVideo}
        className="w-full rounded-xl py-2.5 px-4 mb-3 flex items-center gap-2"
        style={{ border: "1.5px dashed #a78bfa" }}
      >
        <svg className="w-4 h-4 text-purple-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
        </svg>
        <span className="text-purple-600 font-bold text-xs">Watch Demo</span>
        <span className="text-gray-400 text-xs ml-1">({exercise.demo})</span>
      </button>

      {/* Video expanded state */}
      {exercise.showVideo && (
        <div className="mb-3 rounded-xl overflow-hidden">
          <div className="bg-black w-full h-40 flex items-center justify-center relative">
            <span className="text-white text-sm opacity-60">{exercise.name}</span>
            <button className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              Tap to pause
            </button>
          </div>
          <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="12" height="10" rx="2"/><path d="M22 7l-8 5 8 5V7z"/></svg>
              <span className="text-xs text-gray-500">Video: <span className="text-purple-600 font-medium">{exercise.name}</span></span>
            </div>
            <button onClick={onToggleVideo} className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs font-bold">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Sets table */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        <span className="text-gray-400 text-xs font-medium text-center">SET</span>
        <span className="text-gray-400 text-xs font-medium text-center">PREV</span>
        <span className="text-gray-400 text-xs font-medium text-center">KG</span>
        <span className="text-gray-400 text-xs font-medium text-center">REPS</span>
        <span></span>
      </div>
      {exercise.sets.map((s, si) => (
        <div key={si} className="grid grid-cols-5 gap-1 items-center mb-2">
          <span className="text-center font-bold text-gray-800 text-sm">{si + 1}</span>
          <span className="text-center text-gray-400 text-sm">—</span>
          <div className="bg-gray-100 rounded-lg py-1.5 text-center">
            <button onClick={() => onChangeKg(si, s.kg - 1)} className="hidden" />
            <span
              className="text-gray-700 text-sm font-medium cursor-pointer"
              onClick={() => onChangeKg(si, s.kg + 2.5)}
            >{s.kg}</span>
          </div>
          <div className="bg-gray-100 rounded-lg py-1.5 text-center">
            <span
              className="text-gray-700 text-sm font-medium cursor-pointer"
              onClick={() => onChangeReps(si, s.reps + 1)}
            >{s.reps}</span>
          </div>
          <button
            onClick={() => onToggleDone(si)}
            className={`w-7 h-7 mx-auto rounded-full border-2 flex items-center justify-center transition-colors ${s.done ? "border-green-500 bg-green-500" : "border-gray-300"}`}
          >
            {s.done && (
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        </div>
      ))}

      {/* Add/Remove */}
      <div className="flex justify-around mt-3 pt-3 border-t border-gray-100">
        <button onClick={onAddSet} className="text-purple-500 text-xs font-bold">+ ADD SET</button>
        <button onClick={onRemoveSet} className="text-gray-400 text-xs font-bold">— REMOVE</button>
      </div>
    </div>
  );
}

/* ── Meal card ── */
function MealCard({ meal, expanded, onToggle, onToggleComplete, onToggleSaved }: { meal: MealItem; expanded: boolean; onToggle: () => void; onToggleComplete: () => void; onToggleSaved: () => void; }) {
  const isSaved = (meal as any).saved || false;
  return (
    <div className="bg-yellow-50 rounded-2xl mb-3 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">{meal.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{meal.type}</p>
          <p className="text-gray-600 text-xs truncate">{meal.name}</p>
          <p className="text-gray-400 text-xs">{meal.kcal} kcal | P:{meal.protein}...</p>
        </div>
        <button onClick={onToggleComplete} className={`flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-bold flex items-center gap-1 transition-colors ${meal.completed ? "bg-gray-300 text-gray-600" : "bg-green-500 text-white"}`}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          {meal.completed ? "Done" : "Complete"}
        </button>
        <button className="text-gray-400 flex-shrink-0 mx-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
        <button onClick={onToggle} className="text-gray-500 flex-shrink-0">
          <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4">
          <p className="font-bold text-gray-900 text-base mb-1 leading-snug">{meal.type} - {meal.fullName}</p>
          <p className="font-bold text-gray-800 text-sm mb-3">Nutritional Info</p>

          {/* Macros grid — large green numbers matching screenshot */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { val: String(meal.kcal), label: "Calories" },
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

          {/* Cooking/Serving */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs">Cooking Time:</p>
              <p className="font-bold text-gray-800 text-sm">{meal.cookTime}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs">Serving Size:</p>
              <p className="font-bold text-gray-800 text-sm">{meal.serving}</p>
            </div>
          </div>

          {/* Ingredients */}
          <p className="font-bold text-gray-900 text-sm mb-2">Ingredients</p>
          {meal.ingredients.map((ing, i) => (
            <p key={i} className="text-gray-700 text-sm mb-0.5">• {ing}</p>
          ))}

          {/* How to prepare */}
          <p className="font-bold text-gray-900 text-sm mt-4 mb-2">How to Prepare</p>
          {meal.steps.map((step, i) => (
            <p key={i} className="text-gray-700 text-sm mb-3 leading-relaxed">{step}</p>
          ))}

          {/* Save Recipe */}
          <button onClick={onToggleSaved} className={`w-full mt-2 border-2 font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors ${isSaved ? "border-red-500 bg-red-50 text-red-600" : "border-red-400 text-red-500"}`}>
            <svg className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {isSaved ? "Saved" : "Save Recipe"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Plan screen ── */
export default function Screen14() {
  const [activeTab, setActiveTab] = useState<"workouts" | "meals">("workouts");
  const [selectedDay, setSelectedDay] = useState(workoutPlan.currentDayIndex);
  const [workouts, setWorkouts] = useState<Record<number, DayWorkout>>(() => load("plan_workouts", WORKOUT_DATA));
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>(() => load("plan_completedMeals", {}));
  const [savedRecipes, setSavedRecipes] = useState<Record<string, boolean>>(() => load("plan_savedRecipes", {}));

  useEffect(() => { save("plan_workouts", workouts); }, [workouts]);
  useEffect(() => { save("plan_completedMeals", completedMeals); }, [completedMeals]);
  useEffect(() => { save("plan_savedRecipes", savedRecipes); }, [savedRecipes]);

  const dayWorkout = workouts[selectedDay];
  const dayMeals = MEAL_DATA[selectedDay];
  const TODAY = workoutPlan.currentDayIndex;

  const updateExercise = (exIdx: number, updater: (ex: Exercise) => Exercise) => {
    setWorkouts((prev) => {
      const day = { ...prev[selectedDay] };
      const exs = [...day.exercises];
      exs[exIdx] = updater({ ...exs[exIdx], sets: [...exs[exIdx].sets] });
      return { ...prev, [selectedDay]: { ...day, exercises: exs } };
    });
  };

  const toggleVideo = (exIdx: number) =>
    updateExercise(exIdx, (ex) => ({ ...ex, showVideo: !ex.showVideo }));

  const toggleDone = (exIdx: number, setIdx: number) =>
    updateExercise(exIdx, (ex) => {
      const sets = ex.sets.map((s, i) => i === setIdx ? { ...s, done: !s.done } : s);
      return { ...ex, sets };
    });

  const changeKg = (exIdx: number, setIdx: number, val: number) =>
    updateExercise(exIdx, (ex) => {
      const sets = ex.sets.map((s, i) => i === setIdx ? { ...s, kg: Math.max(0, val) } : s);
      return { ...ex, sets };
    });

  const changeReps = (exIdx: number, setIdx: number, val: number) =>
    updateExercise(exIdx, (ex) => {
      const sets = ex.sets.map((s, i) => i === setIdx ? { ...s, reps: Math.max(1, val) } : s);
      return { ...ex, sets };
    });

  const addSet = (exIdx: number) =>
    updateExercise(exIdx, (ex) => ({ ...ex, sets: [...ex.sets, makeSet(0, ex.sets[0]?.reps ?? 4)] }));

  const removeSet = (exIdx: number) =>
    updateExercise(exIdx, (ex) => ({ ...ex, sets: ex.sets.length > 1 ? ex.sets.slice(0, -1) : ex.sets }));

  const toggleMeal = (id: string) =>
    setExpandedMeals((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleMealComplete = (id: string) =>
    setCompletedMeals((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSaveRecipe = (id: string) =>
    setSavedRecipes((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm h-screen bg-white flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20">

          {/* ── Header ── */}
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/goku_main.png" alt="Goku" style={{ width: 52, height: "auto", objectFit: "contain" }} />
              <div>
                <p className="text-gray-700 text-sm">Hey Connect.nexmedia! 👋</p>
                <p className="font-bold text-gray-900 text-base">Here's your custom plan</p>
              </div>
            </div>

            {/* Workouts / Meals tabs — two independent outlined pills matching screenshot */}
            <div className="flex gap-3 justify-center mb-5">
              <button
                onClick={() => setActiveTab("workouts")}
                className={`px-9 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${activeTab === "workouts" ? "border-green-500 text-green-600 bg-green-50" : "border-gray-300 text-gray-500 bg-white"}`}
              >
                Workouts
              </button>
              <button
                onClick={() => setActiveTab("meals")}
                className={`px-9 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${activeTab === "meals" ? "border-green-500 text-green-600 bg-green-50" : "border-gray-300 text-gray-500 bg-white"}`}
              >
                Meals
              </button>
            </div>

            {/* Day title */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <p className="font-bold text-gray-900 text-xl">Day {selectedDay + 1} - {DAY_FULL[selectedDay]}</p>
              {selectedDay === TODAY && (
                <span className="flex items-center gap-1 bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Today
                </span>
              )}
            </div>

            {/* Day selector */}
            <p className="text-gray-400 text-xs text-center mb-2">View other days:</p>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
              {DAYS.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedDay === i
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">
            {/* ── WORKOUTS TAB ── */}
            {activeTab === "workouts" && (
              <>
                {dayWorkout ? (
                  <>
                    <p className="text-gray-700 font-semibold text-sm text-center">{dayWorkout.type} - {dayWorkout.count} exercises planned</p>
                    <p className="text-gray-400 text-xs text-center mb-4">Plan starts today!</p>

                    {/* View Workout History */}
                    <button className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 flex items-center justify-between mb-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="font-bold text-gray-900 text-sm">View Workout History</span>
                      </div>
                      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>

                    {/* Exercise cards */}
                    {dayWorkout.exercises.map((ex, exIdx) => (
                      <ExerciseCard
                        key={exIdx}
                        exercise={ex}
                        exIdx={exIdx}
                        dayIdx={selectedDay}
                        onToggleVideo={() => toggleVideo(exIdx)}
                        onToggleDone={(si) => toggleDone(exIdx, si)}
                        onChangeKg={(si, v) => changeKg(exIdx, si, v)}
                        onChangeReps={(si, v) => changeReps(exIdx, si, v)}
                        onAddSet={() => addSet(exIdx)}
                        onRemoveSet={() => removeSet(exIdx)}
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">Rest day — no workout planned</p>
                  </div>
                )}
              </>
            )}

            {/* ── MEALS TAB ── */}
            {activeTab === "meals" && (
              <>
                {dayMeals ? (
                  <>
                    <p className="text-gray-700 font-semibold text-sm text-center">{dayMeals.kcal} kcal planned</p>
                    <p className="text-gray-400 text-xs text-center mb-4">Plan starts today!</p>

                    {/* View Meal History */}
                    <button className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 flex items-center justify-between mb-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="font-bold text-gray-900 text-sm">View Meal History</span>
                      </div>
                      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>

                    {/* Meal cards */}
                    {dayMeals.items.map((meal) => (
                      <MealCard
                        key={meal.id}
                        meal={{ ...meal, completed: !!completedMeals[meal.id], saved: !!savedRecipes[meal.id] }}
                        expanded={!!expandedMeals[meal.id]}
                        onToggle={() => toggleMeal(meal.id)}
                        onToggleComplete={() => toggleMealComplete(meal.id)}
                        onToggleSaved={() => toggleSaveRecipe(meal.id)}
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">No meals planned for this day</p>
                  </div>
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
