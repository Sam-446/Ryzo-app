import { useLocation } from "wouter";

const activities = [
  {
    id: "sedentary",
    icon: "🪑",
    title: "Sedentary",
    subtitle: "Desk job, little or no exercise",
    iconBg: "bg-gray-100",
  },
  {
    id: "moderately_active",
    icon: "🤸",
    title: "Moderately Active",
    subtitle: "Exercise 3–4 days/week",
    iconBg: "bg-teal-100",
  },
  {
    id: "very_active",
    icon: "🏃",
    title: "Very Active",
    subtitle: "Hard exercise 5–6 days/week",
    iconBg: "bg-orange-100",
  },
  {
    id: "super_active",
    icon: "🏋️",
    title: "Super Active",
    subtitle: "Intense exercise every day or physical job",
    iconBg: "bg-pink-100",
  },
];

export default function Screen05() {
  const [, navigate] = useLocation();

  const handleSelect = (id: string) => {
    localStorage.setItem("onboarding_activity_level", id);
    const goal = localStorage.getItem("onboarding_primary_goal");
    setTimeout(() => {
      if (goal === "maintain") {
        navigate("/workout-time");
      } else {
        navigate("/weekly-pace");
      }
    }, 180);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)",
      }}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative"
        style={{ paddingBottom: 96 }}
      >
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          What is your activity level?
        </h1>

        <div className="flex flex-col gap-3">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => handleSelect(a.id)}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-teal-50 hover:border-teal-300 transition-all active:scale-95"
            >
              <span
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${a.iconBg} flex-shrink-0`}
              >
                {a.icon}
              </span>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900 text-sm">{a.title}</p>
                <p className="text-gray-500 text-xs">{a.subtitle}</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>
          ))}
        </div>

        <img
          src="/assets/goku4.png"
          alt="Goku"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 108,
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
