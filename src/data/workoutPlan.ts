function makeSet(kg, reps) {
  return { kg, reps, previous: "—", completed: false };
}

const week = [
  {
    dayIndex: 0,
    dayName: "Monday",
    dayShort: "Mon",
    isToday: false,
    title: "Push (Strength)",
    type: "Strength",
    duration: "45 min",
    exerciseCount: 5,
    completed: false,
    workoutHistoryRef: null,
    exercises: [
      {
        name: "Barbell Bench Press",
        demoTitle: "Barbell Bench Press",
        sets: Array(5).fill(null).map(() => makeSet(0, 4)),
      },
      {
        name: "Incline Dumbbell Press / Dumbbell Incline Bench Press",
        demoTitle: "Dumbbell Incline Bench Press",
        sets: Array(5).fill(null).map(() => makeSet(0, 6)),
      },
      {
        name: "Overhead Press",
        demoTitle: "Overhead Press",
        sets: Array(5).fill(null).map(() => makeSet(0, 6)),
      },
      {
        name: "Lateral Raises",
        demoTitle: "Lateral Raises",
        sets: Array(4).fill(null).map(() => makeSet(0, 12)),
      },
      {
        name: "Triceps Pushdown",
        demoTitle: "Triceps Pushdown",
        sets: Array(4).fill(null).map(() => makeSet(0, 12)),
      },
    ],
  },
  {
    dayIndex: 1,
    dayName: "Tuesday",
    dayShort: "Tue",
    isToday: true,
    title: "Pull (Strength)",
    type: "Strength",
    duration: "45 min",
    exerciseCount: 5,
    completed: false,
    workoutHistoryRef: null,
    exercises: [
      {
        name: "Weighted Pull-Up / Pull-up",
        demoTitle: "Pull-up (wide front grip)",
        sets: Array(5).fill(null).map(() => makeSet(0, 4)),
      },
      {
        name: "Barbell Row",
        demoTitle: "Barbell Row",
        sets: Array(5).fill(null).map(() => makeSet(0, 6)),
      },
      {
        name: "Cable Row",
        demoTitle: "Cable Row",
        sets: Array(4).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Face Pulls",
        demoTitle: "Face Pulls",
        sets: Array(4).fill(null).map(() => makeSet(0, 15)),
      },
      {
        name: "Bicep Curl",
        demoTitle: "Bicep Curl",
        sets: Array(4).fill(null).map(() => makeSet(0, 12)),
      },
    ],
  },
  {
    dayIndex: 2,
    dayName: "Wednesday",
    dayShort: "Wed",
    isToday: false,
    title: "Legs (Strength)",
    type: "Strength",
    duration: "50 min",
    exerciseCount: 5,
    completed: false,
    workoutHistoryRef: null,
    exercises: [
      {
        name: "Barbell Squat",
        demoTitle: "Barbell Squat",
        sets: Array(5).fill(null).map(() => makeSet(0, 5)),
      },
      {
        name: "Romanian Deadlift",
        demoTitle: "Romanian Deadlift",
        sets: Array(4).fill(null).map(() => makeSet(0, 8)),
      },
      {
        name: "Leg Press",
        demoTitle: "Leg Press",
        sets: Array(4).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Leg Curl",
        demoTitle: "Leg Curl",
        sets: Array(3).fill(null).map(() => makeSet(0, 12)),
      },
      {
        name: "Calf Raises",
        demoTitle: "Calf Raises",
        sets: Array(4).fill(null).map(() => makeSet(0, 15)),
      },
    ],
  },
  {
    dayIndex: 3,
    dayName: "Thursday",
    dayShort: "Thu",
    isToday: false,
    title: "Shoulders (Strength)",
    type: "Strength",
    duration: "45 min",
    exerciseCount: 5,
    completed: false,
    workoutHistoryRef: null,
    exercises: [
      {
        name: "Military Press",
        demoTitle: "Military Press",
        sets: Array(5).fill(null).map(() => makeSet(0, 5)),
      },
      {
        name: "Lateral Raises",
        demoTitle: "Lateral Raises",
        sets: Array(4).fill(null).map(() => makeSet(0, 12)),
      },
      {
        name: "Reverse Pec Deck Fly",
        demoTitle: "Reverse Pec Deck Fly",
        sets: Array(4).fill(null).map(() => makeSet(0, 12)),
      },
      {
        name: "Shrug",
        demoTitle: "Barbell Shrug",
        sets: Array(4).fill(null).map(() => makeSet(0, 8)),
      },
      {
        name: "Face Pulls",
        demoTitle: "Face Pulls",
        sets: Array(3).fill(null).map(() => makeSet(0, 15)),
      },
    ],
  },
  {
    dayIndex: 4,
    dayName: "Friday",
    dayShort: "Fri",
    isToday: false,
    title: "Push (Hypertrophy)",
    type: "Hypertrophy",
    duration: "45 min",
    exerciseCount: 5,
    completed: false,
    workoutHistoryRef: null,
    exercises: [
      {
        name: "Dumbbell Bench Press",
        demoTitle: "Dumbbell Bench Press",
        sets: Array(4).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Cable Flys",
        demoTitle: "Cable Flys",
        sets: Array(4).fill(null).map(() => makeSet(0, 12)),
      },
      {
        name: "Dumbbell Shoulder Press",
        demoTitle: "Dumbbell Shoulder Press",
        sets: Array(4).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Lateral Raises",
        demoTitle: "Lateral Raises",
        sets: Array(4).fill(null).map(() => makeSet(0, 15)),
      },
      {
        name: "Overhead Triceps Extension",
        demoTitle: "Overhead Triceps Extension",
        sets: Array(3).fill(null).map(() => makeSet(0, 12)),
      },
    ],
  },
  {
    dayIndex: 5,
    dayName: "Saturday",
    dayShort: "Sat",
    isToday: false,
    title: "Pull (Hypertrophy)",
    type: "Hypertrophy",
    duration: "45 min",
    exerciseCount: 5,
    completed: false,
    workoutHistoryRef: null,
    exercises: [
      {
        name: "Lat Pulldown",
        demoTitle: "Lat Pulldown",
        sets: Array(4).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Seated Cable Row",
        demoTitle: "Seated Cable Row",
        sets: Array(4).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Single Arm Dumbbell Row",
        demoTitle: "Single Arm Dumbbell Row",
        sets: Array(3).fill(null).map(() => makeSet(0, 10)),
      },
      {
        name: "Rear Delt Fly",
        demoTitle: "Rear Delt Fly",
        sets: Array(3).fill(null).map(() => makeSet(0, 15)),
      },
      {
        name: "Hammer Curl",
        demoTitle: "Hammer Curl",
        sets: Array(3).fill(null).map(() => makeSet(0, 12)),
      },
    ],
  },
  {
    dayIndex: 6,
    dayName: "Sunday",
    dayShort: "Sun",
    isToday: false,
    title: "Rest Day",
    type: "Rest",
    duration: "—",
    exerciseCount: 0,
    completed: false,
    workoutHistoryRef: null,
    exercises: [],
  },
];

export const workoutPlan = {
  planName: "Indian non-veg Fitness Plan",
  startDate: "2025-02-10",
  currentDayIndex: 1,
  week,
};
