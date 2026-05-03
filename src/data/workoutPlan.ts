// This file is now just a fallback/placeholder
// Screen14 reads real data from Supabase

const today = new Date().getDay(); // 0=Sun, 1=Mon...
// Convert JS day (0=Sun) to our index (0=Mon)
const todayIndex = today === 0 ? 6 : today - 1;

export const workoutPlan = {
  planName: "Bro Split",
  startDate: new Date().toISOString().split("T")[0],
  currentDayIndex: todayIndex,
  week: [],
};
