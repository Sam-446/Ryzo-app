export interface ExerciseTemplate {
  exercise_name: string;
  target_sets: number;
  target_reps: string;
  target_kg: number;
  demo_title: string;
  order_index: number;
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

const backExercises = [
  "V-Bar Pulldown",
  "Deadlift",
  "T-Bar Row",
  "Seated Cable Row",
  "Single Arm Dumbbell Row",
  "Rope Face Pulls",
];

const shoulderExercises = [
  "Lateral Raise",
  "Military Press",
  "Overhead Dumbbell Press",
  "Rear Delt Fly",
  "Upright Row",
  "Barbell Shrugs",
];

const chestExercises = [
  "Barbell Bench Press",
  "Decline Smith Machine Press",
  "Cable Fly",
  "Incline Dumbbell Press",
  "Incline Dumbbell Fly",
  "Dumbbell Pullover",
];

const bicepsTricepsExercises = [
  "Barbell Curl",
  "Hammer Curl",
  "Incline Dumbbell Bicep Curl",
  "Concentration Curl",
  "Cable Rope Pushdown",
  "Overhead Tricep Extension",
];

const tricepsForearmsExercises = [
  "Lying Barbell Tricep Extension",
  "Seated Overhead Barbell Extension",
  "Reverse Grip Tricep Pushdown",
  "Kickbacks",
  "Barbell Wrist Curl",
  "Reverse Barbell Curl",
];

const legsAbsExercises = [
  "Barbell Squat",
  "Leg Press",
  "Leg Curl",
  "Calf Raise",
  "Hanging Leg Raise",
  "Cable Crunch",
];

const repsByGoal: Record<string, string> = {
  fat_loss: "14-16",
  muscle_gain: "8-10",
  maintain: "10-12",
};

function buildExercises(names: string[], goal: string): ExerciseTemplate[] {
  return names.map((name, i) => ({
    exercise_name: name,
    target_sets: 3,
    target_reps: repsByGoal[goal],
    target_kg: 0,
    demo_title: name,
    order_index: i + 1,
  }));
}

function buildWeek(goal: string): WorkoutDayTemplate[] {
  return [
    {
      day_name: "Monday",
      day_of_week: 1,
      focus: "Back",
      is_rest_day: false,
      exercises: buildExercises(backExercises, goal),
    },
    {
      day_name: "Tuesday",
      day_of_week: 2,
      focus: "Shoulders",
      is_rest_day: false,
      exercises: buildExercises(shoulderExercises, goal),
    },
    {
      day_name: "Wednesday",
      day_of_week: 3,
      focus: "Chest",
      is_rest_day: false,
      exercises: buildExercises(chestExercises, goal),
    },
    {
      day_name: "Thursday",
      day_of_week: 4,
      focus: "Biceps + Triceps",
      is_rest_day: false,
      exercises: buildExercises(bicepsTricepsExercises, goal),
    },
    {
      day_name: "Friday",
      day_of_week: 5,
      focus: "Triceps + Forearms",
      is_rest_day: false,
      exercises: buildExercises(tricepsForearmsExercises, goal),
    },
    {
      day_name: "Saturday",
      day_of_week: 6,
      focus: "Legs + Abs",
      is_rest_day: false,
      exercises: buildExercises(legsAbsExercises, goal),
    },
    {
      day_name: "Sunday",
      day_of_week: 7,
      focus: "Rest",
      is_rest_day: true,
      exercises: [],
    },
  ];
}

export const workoutTemplates: WorkoutTemplate = {
  fat_loss: buildWeek("fat_loss"),
  muscle_gain: buildWeek("muscle_gain"),
  maintain: buildWeek("maintain"),
};
