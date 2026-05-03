export interface ExerciseTemplate {
  exercise_name: string;
  target_sets: number;
  target_reps: string;
  target_kg: number;
  demo_title: string;
  order_index: number;
  demo_gif?: string;
}

export interface WorkoutDayTemplate {
  day_name: string;
  day_of_week: number;
  focus: string;
  is_rest_day: boolean;
  exercises: ExerciseTemplate[];
}

export interface WorkoutTemplate {
  [goal: string]: WorkoutDayTemplate[];
}

// ─── GIF map — matches exact filenames in /public/assets/exercises/ ───
export const exerciseGifs: Record<string, string> = {
  // BACK
  "v-bar-pulldown":           "/assets/exercises/v-bar-pulldown.gif",
  "romanian-deadlift":        "/assets/exercises/romanian-deadlift.gif",
  "lat-pull-down":            "/assets/exercises/lat-pull-down.gif",
  "seated-cable-row":         "/assets/exercises/seated-cable-row.gif",
  "single-arm-dumbbell-row":  "/assets/exercises/single-arm-dumbbell-row.gif",
  "rope-face-pulls":          "/assets/exercises/rope-face-pulls.gif",
  // SHOULDERS
  "dumbbell-press":           "/assets/exercises/dumbbell-press.gif",
  "military-press":           "/assets/exercises/military-press.gif",
  "lateral-raise":            "/assets/exercises/lateral-raise.gif",
  "rear-delt-fly":            "/assets/exercises/rear-delt-fly.gif",
  "upright-row":              "/assets/exercises/upright-row.gif",
  "dumbell-shrugs":           "/assets/exercises/dumbell-shrugs.gif",
  // CHEST
  "barbell-bench-press":      "/assets/exercises/barbell-bench-press.gif",
  "decline-smith-press":      "/assets/exercises/decline-smith-press.gif",
  "cable-fly":                "/assets/exercises/cable-fly.gif",
  "incline-dumbbell-press":   "/assets/exercises/incline-dumbbell-press.gif",
  "incline-dumbbell-fly":     "/assets/exercises/incline-dumbbell-fly.gif",
  "dumbbell-pullover":        "/assets/exercises/dumbbell-pullover.gif",
  // BICEPS + FOREARMS
  "barbell-curl":             "/assets/exercises/barbell-curl.gif",
  "hammer-curl":              "/assets/exercises/hammer-curl.gif",
  "incline-dumbbell-curl":    "/assets/exercises/incline-dumbbell-curl.gif",
  "concentration-curl":       "/assets/exercises/concentration-curl.gif",
  "barbell-wrist-curl":       "/assets/exercises/barbell-wrist-curl.gif",
  "reverse-barbell-curl":     "/assets/exercises/reverse-barbell-curl.gif",
  // TRICEPS
  "skull-crushers":           "/assets/exercises/skull-crushers.gif",
  "seated-barbell-extension":"/assets/exercises/seated-barbell-extension.gif",
  "one-arm-extension":    "/assets/exercises/one-arm-extension.gif",
  "straight-grip-pushdown":                "/assets/exercises/straight-grip-pushdown.gif",
  "seated-dumbbell-extension":      "/assets/exercises/seated-dumbbell-extension.gif",
  "kickbacks":"/assets/exercises/kickbacks.gif",
  // LEGS + ABS
  "barbell-squat":            "/assets/exercises/barbell-squat.gif",
  "leg-press":                "/assets/exercises/leg-press.gif",
  "leg-curl":                 "/assets/exercises/leg-curl.gif",
  "calf-raise":               "/assets/exercises/calf-raise.gif",
  "hanging-leg-raise":        "/assets/exercises/hanging-leg-raise.gif",
  "cable-crunch":             "/assets/exercises/cable-crunch.gif",
};

// ─── Exercise name lists — these are the exact names saved to Supabase ───

const backExercises = [
  "v-bar-pulldown",
  "romanian-deadlift",
  "lat-pull-down",
  "seated-cable-row",
  "single-arm-dumbbell-row",
  "rope-face-pulls",
];

const shoulderExercises = [
  "dumbbell-press",
  "military-press",
  "lateral-raise",
  "rear-delt-fly",
  "upright-row",
  "dumbell-shrugs",
];

const chestExercises = [
  "barbell-bench-press",
  "decline-smith-press",
  "cable-fly",
  "incline-dumbbell-press",
  "incline-dumbbell-fly",
  "dumbbell-pullover",
];

// Thursday — Biceps (4) + Forearms (2)
const bicepsForearmsExercises = [
  "barbell-curl",
  "hammer-curl",
  "incline-dumbbell-curl",
  "concentration-curl",
  "barbell-wrist-curl",
  "reverse-barbell-curl",
];

// Friday — Triceps (6)
const tricepsExercises = [
  "skull-crushers",
  "seated-barbell-extension",
  "one-arm-extension",
  "straight-grip-pushdown",
  "seated-dumbbell-extension",
  "kickbacks",
];

const legsAbsExercises = [
  "barbell-squat",
  "leg-press",
  "leg-curl",
  "calf-raise",
  "hanging-leg-raise",
  "cable-crunch",
];

const repsByGoal: Record<string, string> = {
  fat_loss:     "14-16",
  muscle_gain:  "8-10",
  maintain:     "10-12",
};

function buildExercises(names: string[], goal: string): ExerciseTemplate[] {
  return names.map((name, i) => ({
    exercise_name: name,
    target_sets:   3,
    target_reps:   repsByGoal[goal] || "10-12",
    target_kg:     0,
    demo_title:    name,
    order_index:   i + 1,
    demo_gif:      exerciseGifs[name] || "",
  }));
}

// ─── Sunday Rest (default) ───
function buildWeekSundayRest(goal: string): WorkoutDayTemplate[] {
  return [
    { day_name: "Monday",    day_of_week: 1, focus: "Back",              is_rest_day: false, exercises: buildExercises(backExercises,           goal) },
    { day_name: "Tuesday",   day_of_week: 2, focus: "Shoulders",         is_rest_day: false, exercises: buildExercises(shoulderExercises,        goal) },
    { day_name: "Wednesday", day_of_week: 3, focus: "Chest",             is_rest_day: false, exercises: buildExercises(chestExercises,           goal) },
    { day_name: "Thursday",  day_of_week: 4, focus: "Biceps + Forearms", is_rest_day: false, exercises: buildExercises(bicepsForearmsExercises,  goal) },
    { day_name: "Friday",    day_of_week: 5, focus: "Triceps",           is_rest_day: false, exercises: buildExercises(tricepsExercises,         goal) },
    { day_name: "Saturday",  day_of_week: 6, focus: "Legs + Abs",        is_rest_day: false, exercises: buildExercises(legsAbsExercises,         goal) },
    { day_name: "Sunday",    day_of_week: 7, focus: "Rest",              is_rest_day: true,  exercises: [] },
  ];
}

// ─── Friday Rest ───
function buildWeekFridayRest(goal: string): WorkoutDayTemplate[] {
  return [
    { day_name: "Saturday",  day_of_week: 6, focus: "Back",              is_rest_day: false, exercises: buildExercises(backExercises,           goal) },
    { day_name: "Sunday",    day_of_week: 7, focus: "Shoulders",         is_rest_day: false, exercises: buildExercises(shoulderExercises,        goal) },
    { day_name: "Monday",    day_of_week: 1, focus: "Chest",             is_rest_day: false, exercises: buildExercises(chestExercises,           goal) },
    { day_name: "Tuesday",   day_of_week: 2, focus: "Triceps",           is_rest_day: false, exercises: buildExercises(tricepsExercises,         goal) },
    { day_name: "Wednesday", day_of_week: 3, focus: "Biceps + Forearms", is_rest_day: false, exercises: buildExercises(bicepsForearmsExercises,  goal) },
    { day_name: "Thursday",  day_of_week: 4, focus: "Legs + Abs",        is_rest_day: false, exercises: buildExercises(legsAbsExercises,         goal) },
    { day_name: "Friday",    day_of_week: 5, focus: "Rest",              is_rest_day: true,  exercises: [] },
  ];
}

export const workoutTemplates: WorkoutTemplate = {
  fat_loss:     buildWeekSundayRest("fat_loss"),
  muscle_gain:  buildWeekSundayRest("muscle_gain"),
  maintain:     buildWeekSundayRest("maintain"),
};

export const workoutTemplatesFridayRest: WorkoutTemplate = {
  fat_loss:     buildWeekFridayRest("fat_loss"),
  muscle_gain:  buildWeekFridayRest("muscle_gain"),
  maintain:     buildWeekFridayRest("maintain"),
};
