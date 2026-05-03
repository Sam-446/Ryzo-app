import { useLocation } from "wouter";

const goals = [
  { id: "fat_loss", emoji: "🔥", label: "Lose Fat", bg: "bg-green-100" },
  { id: "muscle_gain", emoji: "💪", label: "Gain Muscle", bg: "bg-yellow-100" },
  { id: "maintain", emoji: "⚖️", label: "Maintain Weight", bg: "bg-blue-100" },
];

export default function Screen02() {
  const [, navigate] = useLocation();

  const handleSelect = (id: string) => {
    localStorage.setItem("onboarding_primary_goal", id);
    navigate("/gender-age");
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
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
          What is your primary goal?
        </h1>

        <div className="flex flex-col gap-4 mb-8">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left font-bold text-gray-900 text-base transition-all active:scale-95 ${g.bg}`}
            >
              <span className="text-2xl">{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </div>

        <img
          src="/assets/goku1.png"
          alt="Goku"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 115,
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
