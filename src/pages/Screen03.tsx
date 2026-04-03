import { useState } from "react";
import { useLocation } from "wouter";

export default function Screen03() {
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft-in">("cm");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [, navigate] = useLocation();

  const canContinue = height.trim() !== "" && weight.trim() !== "";

  const handleContinue = () => {
    if (canContinue) {
      localStorage.setItem("onboarding_height", height);
      localStorage.setItem("onboarding_height_unit", heightUnit);
      localStorage.setItem("onboarding_current_weight", weight);
      localStorage.setItem("onboarding_weight_unit", weightUnit);
      navigate("/goal-weight");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg relative" style={{ paddingBottom: 96 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
          Tell us about your body stats
        </h1>

        <div className="mb-6">
          <p className="font-bold text-gray-900 mb-2">Height</p>
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-3 bg-gray-50">
            <input
              type="number"
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-400 placeholder:text-gray-300 text-base"
            />
            <div className="flex gap-1">
              <button onClick={() => setHeightUnit("cm")} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${heightUnit === "cm" ? "bg-green-100 text-green-700" : "text-gray-400"}`}>cm</button>
              <button onClick={() => setHeightUnit("ft-in")} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${heightUnit === "ft-in" ? "bg-green-100 text-green-700" : "text-gray-400"}`}>ft-in</button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-bold text-gray-900 mb-2">Weight</p>
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-3 bg-gray-50">
            <input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-400 placeholder:text-gray-300 text-base"
            />
            <div className="flex gap-1">
              <button onClick={() => setWeightUnit("kg")} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${weightUnit === "kg" ? "bg-green-100 text-green-700" : "text-gray-400"}`}>kg</button>
              <button onClick={() => setWeightUnit("lb")} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${weightUnit === "lb" ? "bg-green-100 text-green-700" : "text-gray-400"}`}>lb</button>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-semibold text-base transition-colors ${canContinue ? "bg-green-400 hover:bg-green-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
        >
          Continue
        </button>
        {!canContinue && (
          <p className="text-center text-sm text-gray-400 mt-2">Please enter your height and weight</p>
        )}

        <img
          src="/assets/goku2.png"
          alt="Goku"
          style={{ position: "absolute", bottom: 8, right: 8, width: 116, height: "auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
