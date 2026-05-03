import { useState } from "react";
import { useLocation } from "wouter";

export default function ScreenBodyStats() {
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [, navigate] = useLocation();

  const feet = parseFloat(heightFt) || 0;
  const inches = parseFloat(heightIn) || 0;
  const previewCm = feet > 0 ? Math.round((feet * 12 + inches) * 2.54) : null;
  const canContinue = heightFt.trim() !== "" && weight.trim() !== "";

  const handleContinue = () => {
    if (!canContinue) return;
    const heightInCm = Math.round((feet * 12 + inches) * 2.54);
    localStorage.setItem("onboarding_height", String(heightInCm));
    localStorage.setItem("onboarding_height_unit", "cm");
    localStorage.setItem("onboarding_current_weight", weight);
    localStorage.setItem("onboarding_weight_unit", weightUnit);
    navigate("/goal-weight");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #a8eddc 0%, #e8f5e0 50%, #f0f0ff 100%)",
      }}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Your measurements
        </h1>

        {/* Height */}
        <div className="mb-6">
          <p className="font-bold text-gray-700 mb-3">Height</p>
          <div className="flex gap-3">
            <div className={`flex-1 flex items-center border-2 rounded-2xl px-4 py-4 transition-colors ${
              heightFt
                ? "border-teal-400 bg-teal-50"
                : "border-gray-200 bg-gray-50 focus-within:border-teal-200"
            }`}>
              <input
                type="number"
                placeholder="5"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300 text-2xl font-bold w-full"
              />
              <span className="text-gray-400 text-sm font-medium">ft</span>
            </div>
            <div className={`flex-1 flex items-center border-2 rounded-2xl px-4 py-4 transition-colors ${
              heightIn
                ? "border-teal-400 bg-teal-50"
                : "border-gray-200 bg-gray-50 focus-within:border-teal-200"
            }`}>
              <input
                type="number"
                placeholder="11"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300 text-2xl font-bold w-full"
              />
              <span className="text-gray-400 text-sm font-medium">in</span>
            </div>
          </div>
          {previewCm && (
            <div className="mt-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2 text-center">
              <span className="text-teal-600 text-sm font-bold">
                {heightFt}ft {heightIn || "0"}in = {previewCm}cm ✓
              </span>
            </div>
          )}
        </div>

        {/* Weight */}
        <div className="mb-8">
          <p className="font-bold text-gray-700 mb-3">Current Weight</p>
          <div className="flex gap-2 mb-3">
            {(["kg", "lb"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setWeightUnit(u)}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold border-2 transition-all ${
                  weightUnit === u
                    ? "border-teal-400 bg-teal-50 text-teal-700"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
          <div className={`flex items-center border-2 rounded-2xl px-5 py-4 transition-colors ${
            weight
              ? "border-teal-400 bg-teal-50"
              : "border-gray-200 bg-gray-50 focus-within:border-teal-200"
          }`}>
            <input
              type="number"
              placeholder={weightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300 text-2xl font-bold"
            />
            <span className="text-gray-400 text-sm font-medium">{weightUnit}</span>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-bold text-base transition-all ${
            canContinue
              ? "bg-teal-400 hover:bg-teal-500 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>

        {!canContinue && (
          <p className="text-center text-xs text-gray-300 mt-3">
            Fill in your height and weight to continue
          </p>
        )}
      </div>
    </div>
  );
}
