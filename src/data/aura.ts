export const aura = {
  total: 0,
  level: "Starting",
  levelThresholds: [
    { level: "Starting",   minAura: 0 },
    { level: "Glowing",    minAura: 100 },
    { level: "Radiant",    minAura: 500 },
    { level: "Luminous",   minAura: 1000 },
    { level: "Blazing",    minAura: 2500 },
    { level: "Legendary",  minAura: 5000 },
  ],
  streakMilestones: [
    { days: 3,  reward: "Bronze Glow Badge",    unlocked: false },
    { days: 7,  reward: "Silver Glow Badge",    unlocked: false },
    { days: 14, reward: "Gold Glow Badge",      unlocked: false },
    { days: 30, reward: "Platinum Streak Ring", unlocked: false },
    { days: 60, reward: "Diamond Aura Halo",    unlocked: false },
    { days: 90, reward: "Legendary Glow Crown", unlocked: false },
  ],
  achievements: [
    { id: "first_workout",  label: "First Workout",   unlocked: false, icon: "🏋️" },
    { id: "first_meal",     label: "First Meal Log",  unlocked: false, icon: "🍽️" },
    { id: "week_streak",    label: "7-Day Streak",    unlocked: false, icon: "🔥" },
    { id: "hydrated",       label: "Hydration Hero",  unlocked: false, icon: "💧" },
    { id: "macro_master",   label: "Macro Master",    unlocked: false, icon: "📊" },
    { id: "month_warrior",  label: "30-Day Warrior",  unlocked: false, icon: "⚡" },
  ],
};
