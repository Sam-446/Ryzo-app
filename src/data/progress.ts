export const progress = {
  auraPoints: 0,
  levelName: "Starting",
  streak: {
    current: 0,
    best: 0,
    weeks: 0,
    milestones: [3, 7, 14, 30, 60, 90],
  },
  currentWeekCompletion: 0,
  weeklyReport: {
    title: "Weekly Report",
    subtitle: "View your progress summary",
    workoutsCompleted: 0,
    workoutsPlanned: 5,
    caloriesBurned: 0,
    averageCaloriesConsumed: 0,
  },
  achievements: [],
  achievementsPlaceholder: "Complete your first workout to unlock achievements!",
  progressComparison: {
    title: "Progress Comparison",
    subtitle: "Track your transformation with before/dream/now photos",
    ctaText: "View Comparison",
    photos: {
      before: null,
      dream: null,
      now: null,
    },
  },
  bodyFatAnalyzer: {
    title: "AI Body Fat Analyzer",
    subtitle: "Take a photo and get an instant body fat estimate powered by AI",
    ctaText: "Upgrade to Pro",
    isPro: false,
  },
};
